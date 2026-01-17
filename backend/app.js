const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql2')

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.use(bodyParser.urlencoded({ extended: true }))

const connection = mysql.createConnection({
  host: 'ucka.veleri.hr',
  user: 'dsepic',
  password: '11',
  port: 3306,
  database: 'dsepic',
})

app.use(express.urlencoded({ extended: true }))

connection.connect(function (err) {
  if (err) {
    console.error('MySQL connection error:', err)
    return
  }
  console.log('Connected to MySQL!')
})

app.get('/api/users', (req, res) => {
  connection.query('SELECT id, name FROM users2', (err, results) => {
    if (err) return res.status(500).send(err)
    res.json(results)
  })
})

//troskovi po odabranom useru
app.get('/api/troskovi', (req, res) => {
  const userId = req.query.userId
  if (!userId) return res.status(400).send('userId is required')

  connection.query(
    'SELECT * FROM troskovi2 WHERE user_id = ? ORDER BY date DESC',
    [userId],
    (err, results) => {
      if (err) return res.status(500).send(err)
      res.json(results)
    },
  )
})

app.post('/api/unostTroskova', (req, res) => {
  const { userId, category, amount, date } = req.body
  if (!userId || !category || !amount || !date) return res.status(400).send('Missing fields')

  connection.query(
    'INSERT INTO troskovi2 (user_id, category, amount, date) VALUES (?, ?, ?, ?)',
    [userId, category, amount, date],
    (err, result) => {
      if (err) return res.status(500).send(err)
      res.json({ id: result.insertId })
    },
  )
})

app.listen(port, () => {
  console.log('Server running at port: ' + port)
})
