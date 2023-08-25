const express = require('express')
const bodyParser = require('body-parser')
const mariadb = require('mariadb')
const path = require('path')
const fs = require('fs')
const app = express()
// const http = require('http').Server(app)
const https = require('https')
const port = 8080
const cors = require('cors')
const buildPath = path.join(__dirname, '..', 'build')
require('dotenv').config({ path: path.join(__dirname, '../.env') })
const ruleConfigPath = path.join(__dirname, process.env.CONFIG_PATH)
const tableName = process.env.DB_TABLE
const httpsOptions = {
  key: fs.readFileSync('private-key.key'), // private key certificate
  cert: fs.readFileSync('ServerCertificate.crt') //SSL certificate
}

const server = https.createServer(httpsOptions, app)

app.use(express.static(buildPath))
app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'")
  next()
})


app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Error in body' })
  }

  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
})

const safeKeys = []
const safePorts = []
const safeTitles = []
const safeFailTexts = []
const safeFailRules = []
const safePassRules = []
const safeMaxTries = []
const safeContinueOption = []
const safeWarning = []

let pool 

try {
  // Create a connection to the database
  pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  })

  const rules = JSON.parse(fs.readFileSync(ruleConfigPath, 'utf8'))
  const rulesArray = Object.values(rules)

  rulesArray.forEach(({ key, port, title, failText, failRule, passRule, maxTries, continueOption, warning }) => {
    safeKeys.push(key)
    safePorts.push(port)
    safeTitles.push(title)
    safeFailTexts.push(failText)
    safeFailRules.push(failRule)
    safePassRules.push(passRule)
    safeMaxTries.push(maxTries)
    safeContinueOption.push(continueOption)
    safeWarning.push(warning)
  })
} catch (error) {
  console.error('An error occurred:', error)
}


// Middleware to check if post data has been tampered with
const sanitizeHttpRequest = (req, res, next) => {
  try {
    const { uid, sequence, action, result } = req.body
    const safeHttpResponses = /^[1-5]\d{2}$/
    const safeUUIDLength = 36
    const safeUUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    const cookies = req.headers.cookie
    const userUuidCookie = cookies.split(';').find(cookie => cookie.trim().startsWith('user_uuid='))
    const userUuid = userUuidCookie ? userUuidCookie.split('=')[1] : null
    const contentType = req.headers['content-type']


    // Check if all sequence properties match the safe values defined earlier
    const sequenceIsSafe = Object.values(sequence).every((item) => {
      return (
        safePorts.some((safePort) => safePort === item.port) &&
        safeTitles.some((safeTitle) => safeTitle === item.title) &&
        safeFailTexts.some((safeFailText) => safeFailText === item.failText) &&
        safeFailRules.some((safeFailRule) => safeFailRule === item.failRule) &&
        safePassRules.some((safePassRule) => safePassRule === item.passRule) &&
        safeKeys.some((safeKey) => safeKey === item.key) &&
        safeMaxTries.some((safeMaxTries) => safeMaxTries === item.maxTries) &&
        safeContinueOption.some((safeContinueOption) => safeContinueOption === item.continueOption) &&
        safeWarning.some((safeWarning) => safeWarning === item.warning) &&
      ((safeHttpResponses).test(item.responseStatus) || item.responseStatus === null) // null due to current way of testing for failures
      )
    })


    // Check if action and result properties are valid
    const actionAndResultAreSafe = () => {
      return (
          (action === "restart" || action === "retry" || action === "start" || action === "continue") &&
          (result === "incomplete" || result === "completed successfully" ||
          result === "completed successfully with warning(s)" || result === "completed unsuccessfully")
      )
    }


    // Check if the UUID and the user_uuid cookie are valid
    const uuidIsSafe = () => {
      return ((safeUUIDPattern.test(uid) && uid.length === safeUUIDLength) && (safeUUIDPattern.test(userUuid) && userUuid.length === safeUUIDLength))
    }


    // Call the sanitization checks, and return a 405 status code (which cancels the request) if any of them return false
    if (!sequenceIsSafe || !actionAndResultAreSafe() || !uuidIsSafe() || contentType !== 'application/json') {
      return res.status(405).json({ message: 'Data has been tampered with, ceasing request.' })
    }
      next()
  } catch(err){
    console.log(err)
    res.status(500).json({ message: " Error in middleware" })
  }
}


// Inserts the data into the database.
app.post('/api/data', sanitizeHttpRequest, async (req, res) => {
  try {
    const { uid, sequence, action, result } = req.body
    const sequenceJson = JSON.stringify(sequence)
    const sanitizedIp = encodeURIComponent(req.ip)
    const timestamp = new Date()
    const userAgent = req.headers['user-agent']
    const sanitizedUserAgent = encodeURIComponent(userAgent)

    try {
        conn = await pool.getConnection()
        const query = `INSERT INTO ${tableName} (uuid, sequence, ip, action, result, timestamp, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)`
        const queryResult = await conn.query(query, [uid, sequenceJson, sanitizedIp, action, result, timestamp, sanitizedUserAgent])
        res.status(200).json({ message: 'Data inserted successfully' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error inserting data' })
    } finally {
        if (conn) return conn.end()
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: " Error getting data from request body" })
  }
})


/**
 * Handle GET request to '/api/rules'
 * Sends the rules configuration file to the client.
 */ 
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
  try {
    res.sendFile(path.join(buildPath, 'index.html'))
  } catch (err) {
    console.log(err)
    res.status(500).send(" Error serving React app")
  }
})


try {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
} catch (err) {
  console.log(err)
  res.status(500).send("Error starting server")
}


// // Start the server
// http.listen(port, () => {
//     console.log(`Server is running on port ${port}`)
// })