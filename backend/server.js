const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const SECRET = "mysecret";

const db = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'testdb'
});

// 🔐 Middleware
function authenticate(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// 🔹 Signup
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hash],
    (err) => {
      if (err) return res.send(err);
      res.send("User registered");
    }
  );
});

// 🔹 Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE username=?',
    [username],
    async (err, result) => {
      if (result.length === 0) return res.send("User not found");

      const valid = await bcrypt.compare(password, result[0].password);
      if (!valid) return res.send("Invalid password");

      const token = jwt.sign({ username }, SECRET);
      res.json({ token });
    }
  );
});

// 🔹 Protected Route
app.get('/users', authenticate, (req, res) => {
  db.query('SELECT id, username FROM users', (err, result) => {
    res.json(result);
  });
});

app.listen(3000, () => console.log('Server running'));
