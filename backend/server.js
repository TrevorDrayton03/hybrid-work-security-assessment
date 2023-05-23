const express = require('express')
const bodyParser = require('body-parser')
const mariadb = require('mariadb')
const path = require('path')
const fs = require('fs')
const app = express()
const http = require('http').Server(app)
const port = 80
// const cors = require('cors')
const buildPath = path.join(__dirname, '..', 'build')
const ruleConfigPath = path.join(__dirname, "./rule_config.json")
const io = require('socket.io')(http
    //     , {
    //     cors: {
    //         origin: "http://localhost:80",
    //         methods: ["GET", "POST"]
    //     }
    // }
)
require('dotenv').config({ path: path.join(__dirname, '../.env') })


app.use(express.static(buildPath))
app.use(express.json())
// app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: process.env.DB_CONNECTION_LIMIT
})

io.on('connection', (socket) => {
    console.log('Client connected')
    socket.emit('configUpdate', JSON.parse(fs.readFileSync(ruleConfigPath, 'utf8')))

    socket.on('disconnect', () => {
        console.log('Client disconnected')
    })
})

const handleLog = async (uuid, sequence, ip, action, timestamp, userAgent) => {
    let conn
    try {
        conn = await pool.getConnection()
        const res = await conn.query('INSERT INTO test_table2 (uuid, sequence, ip, action, timestamp, user_agent) VALUES (?, ?, ?, ?, ?, ?)', [uuid, sequence, ip, action, timestamp, userAgent])
        console.log(res)
    } catch (err) {
        // throw err
        console.log(err)
    } finally {
        if (conn) return conn.end()
    }
}

app.post('/api/data', (req, res) => {
    const { uid, sequence, action } = req.body
    const sequenceJson = JSON.stringify(sequence);
    let timestamp = new Date();
    console.log(uid, sequence, req.ip, action, timestamp, req.headers['user-agent']);
    handleLog(uid, sequenceJson, req.ip, action, timestamp, req.headers['user-agent'])
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