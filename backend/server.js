require('dotenv').config()

const express = require('express')
const mariadb = require('mariadb')
const path = require('path');
const app = express()
const port = 5000
const db_port = process.env.DB_PORT

const buildPath = path.join(__dirname, '..', 'build');

app.use(express.static(buildPath));

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
})

app.get('/api/data', (req, res) => {
    pool.getConnection()
        .then((conn) => {
            conn.query('SELECT * FROM your_table')
                .then((rows) => {
                    res.json(rows)
                    conn.release()
                })
                .catch((err) => {
                    conn.release()
                    res.status(500).json({ error: err })
                })
        })
        .catch((err) => {
            res.status(500).json({ error: err })
        })
})

app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(port || db_port, () => {
    console.log(`Server is running on port ${port}`)
})
