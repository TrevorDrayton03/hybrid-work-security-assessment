require('dotenv').config()

const express = require('express')
const mariadb = require('mariadb')
const path = require('path');
const app = express()
const port = 5000

const buildPath = path.join(__dirname, '..', 'build');

app.use(express.static(buildPath));
app.use(express.json());

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
})

app.post('/api/data', (req, res) => {
    const { name } = req.body;
    pool.getConnection()
        .then((conn) => {
            conn.query('INSERT INTO test_table (name) VALUES (?)', [name])
                .then(() => {
                    res.sendStatus(200);
                    conn.release();
                })
                .catch((err) => {
                    conn.release();
                    res.status(500).json({ error: err });
                });
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
