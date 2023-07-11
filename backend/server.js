const express = require('express')
const bodyParser = require('body-parser')
const mariadb = require('mariadb')
const path = require('path')
const fs = require('fs')
const app = express()
const http = require('http').Server(app)
const port = 80
const cors = require('cors')
const buildPath = path.join(__dirname, '..', 'build')
require('dotenv').config({ path: path.join(__dirname, '../.env') })
const ruleConfigPath = path.join(__dirname, process.env.CONFIG_PATH)

app.use(express.static(buildPath))
app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: process.env.DB_CONNECTION_LIMIT
})

const rules = JSON.parse(fs.readFileSync(ruleConfigPath, 'utf8'))
const rulesArray = Object.values(rules)
const safeKeys = rulesArray.map(({ key }) => key)
const safePorts = rulesArray.map(({ port }) => port)
const safeTitles = rulesArray.map(({ title }) => title)
const safeFailTexts = rulesArray.map(({ failText }) => failText)
const safeFailRules = rulesArray.map(({ failRule }) => failRule)
const safePassTexts = rulesArray.map(({ passText }) => passText)
const safePassRules = rulesArray.map(({ passRule }) => passRule)
const safeMaxTries = rulesArray.map(({ maxTries }) => maxTries)
const safePauseOnFail = rulesArray.map(({ pauseOnFail }) => pauseOnFail)

// console.log(safeKeys);
// console.log(safePorts);
// console.log(safeTitles);
// console.log(safeFailTexts);
// console.log(safeFailRules);
// console.log(safePassTexts);
// console.log(safePassRules);
// console.log(safeMaxTries);
// console.log(safePauseOnFail);

const isPostDataTampered = (req, res, next) => {
  const { uid, sequence, action, result } = req.body
  const safeHttpResponses = /^[1-5]\d{2}$/
  const safeUUIDLength = 36
  const safeUUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const sequenceIsSafe = Object.values(sequence).every((item) => {
    return (
      safePorts.some((safePort) => safePort === item.port) &&
      safeTitles.some((safeTitle) => safeTitle === item.title) &&
      safeFailTexts.some((safeFailText) => safeFailText === item.failText) &&
      safeFailRules.some((safeFailRule) => safeFailRule === item.failRule) &&
      safePassTexts.some((safePassText) => safePassText === item.passText) &&
      safePassRules.some((safePassRule) => safePassRule === item.passRule) &&
      safeKeys.some((safeKey) => safeKey === item.key) &&
      safeMaxTries.some((safeMaxTries) => safeMaxTries === item.maxTries) &&
      safePauseOnFail.some((safePauseOnFail) => safePauseOnFail === item.pauseOnFail) &&
    ((safeHttpResponses).test(item.responseStatus) || item.responseStatus === null) // null due to current way of testing for failures
    );
  });

  const actionAndResultAreSafe = () => {
    return (
        (action === "restart" || action === "retry" || action === "start" || action === "continue") &&
        (result === "pass" || result === "fail")
    )
}


  const uuidIsSafe = () => {
    return safeUUIDPattern.test(uid) && uid.length === safeUUIDLength;
  }

  if (!sequenceIsSafe || !actionAndResultAreSafe() || !uuidIsSafe()) {
    return res.status(405).json({ message: 'Data has been tampered with, ceasing request.' });
  }
    next();
};

app.post('/api/data', isPostDataTampered, async (req, res) => {
    const { uid, sequence, action, result } = req.body
    const sequenceJson = JSON.stringify(sequence);
    let timestamp = new Date();
    try {
        conn = await pool.getConnection()
        const queryResult  = await conn.query('INSERT INTO test_table3 (uuid, sequence, ip, action, result, timestamp, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)', [uid, sequenceJson, req.ip, action, result, timestamp, req.headers['user-agent']])
        console.log(queryResult)
        res.status(200).json({ message: 'Data inserted successfully' });
    } catch (err) {
        // throw err
        console.log(err)
        res.status(500).json({ message: 'Error inserting data' });
    } finally {
        if (conn) return conn.end()
    }
})

app.get('/api/rules', (req, res) => {
    try {
        const data = fs.readFileSync(ruleConfigPath, 'utf8')
        res.send(data)
    } catch (err) {
        console.error('Error reading file:', err)
        res.status(500).send('Error reading file')
    }
})

app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'))
})

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`)
// })

http.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})