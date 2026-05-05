const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const SECRET = "mysecret";

// ✅ DB connection
const db = mysql.createConnection({
  host: 'db',   
  user: 'root',
  password: 'root',
  database: 'testdb'
});

// 🔐 FIXED Middleware
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ error: "No token provided" });
  }

  // 🔥 Extract token from "Bearer <token>"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: "Invalid token format" });
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    req.user = user;
    next();
  });
}

// 🔹 Signup
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hash],
      (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "User registered" });
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
});

// 🔹 Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE username=?',
    [username],
    async (err, result) => {

      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const valid = await bcrypt.compare(password, result[0].password);

      if (!valid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });

      res.json({ token });
    }
  );
});

// 🔹 Protected Route
app.get('/users', authenticate, (req, res) => {
  db.query('SELECT id, username FROM users', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));
