require('dotenv').config()
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

async function asyncFunction(name) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT 1 as val");
        console.log(rows); //[ {val: 1}, meta: ... ]
        const res = await conn.query('INSERT INTO test_table (name) VALUES (?)', [name]);
        console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }

    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
}

app.post('/api/data', (req, res) => {
    const { name } = req.body
    console.log(name)
    // pool.getConnection()
    //     .then((conn) => {
    //         conn.query('INSERT INTO test_table (name) VALUES (?)', [name])
    //         // conn.query('SELECT * FROM test_table')
    //             .then(() => {
    //                 console.log(res)
    //                 res.sendStatus(200)
    //                 conn.release()
    //             })
    //             .catch((err) => {
    //                 conn.release()
    //                 res.status(500).json({ error: err })
    //             })
    //     })
    //     .catch((err) => {
    //         res.status(500).json({ error: err })
    //     })
    asyncFunction(name)
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