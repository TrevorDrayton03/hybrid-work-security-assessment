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
const io = require('socket.io')(http)
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

let rules = fs.readFileSync(ruleConfigPath, 'utf8')
rules = JSON.parse(rules)
const rulesArray = Object.values(rules)
const ruleKeys = rulesArray.map(({ key }) => key)
const rulePorts = rulesArray.map(({ port }) => port)
const ruleTitles = rulesArray.map(({ title }) => title)
const ruleFailTexts = rulesArray.map(({ failText }) => failText)
const ruleFailRules = rulesArray.map(({ failRule }) => failRule)
const rulePassTexts = rulesArray.map(({ passText }) => passText)
const rulePassRules = rulesArray.map(({ passRule }) => passRule)

console.log(ruleKeys);
console.log(rulePorts);
console.log(ruleTitles);
console.log(ruleFailTexts);
console.log(ruleFailRules);
console.log(rulePassTexts);
console.log(rulePassRules);

io.on('connection', (socket) => {
    console.log('Client connected')
    socket.emit('configUpdate', JSON.parse(fs.readFileSync(ruleConfigPath, 'utf8')))

    socket.on('disconnect', () => {
        console.log('Client disconnected')
    })
})

const isPostDataTampered = (req, res, next) => {
  const { uid, sequence, action, result } = req.body
  
  const sequenceIsSafe = Object.values(sequence).every((item) => {
    return (
      rulePorts.some((port) => port === item.port) &&
      ruleTitles.some((title) => title === item.title) &&
      ruleFailTexts.some((failText) => failText === item.failText) &&
      ruleFailRules.some((failRule) => failRule === item.failRule) &&
      rulePassTexts.some((passText) => passText === item.passText) &&
      rulePassRules.some((passRule) => passRule === item.passRule) &&
      ruleKeys.some((key) => key === item.key)
    );
  });

  const actionAndResultAreSafe = () => {
    return (
        action === "restart" || "retry" || "start" &&
        result === "pass" || "fail"
    )
  }

  const validUUIDLength = 36; 

const uuidIsSafe = () => {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidPattern.test(uid) && uid.length === validUUIDLength;
}
  if (!sequenceIsSafe || !actionAndResultAreSafe || !uuidIsSafe) {
    return res.status(400).json({ message: 'Data tampered' });
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

fs.watchFile(ruleConfigPath, (curr, prev) => {
    if (curr.mtime > prev.mtime) {
        fs.readFile(ruleConfigPath, 'utf8', (err, data) => {
            if (!err) {
                const config = JSON.parse(data)
                io.emit('configUpdate', config)
                console.log("config update emitted")
            }
        })
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