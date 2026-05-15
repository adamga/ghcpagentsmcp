const express = require('express');
const jwt = require('jsonwebtoken');
const {
  hashPassword,
  removePlaintextPassword,
  validateCredentials,
  verifyPassword,
} = require('../authUtils');

function createAuthRouter({ usersFile, readJSON, writeJSON, SECRET_KEY }) {
  const router = express.Router();

  router.post('/register', (req, res) => {
    const { username, password } = req.body;
    const validation = validateCredentials(username, password);
    if (!validation.valid) return res.status(400).json({ message: validation.message });
    const users = readJSON(usersFile);
    if (users.find(u => u.username === validation.username)) {
      return res.status(409).json({ message: 'User already exists' });
    }
    users.push({
      username: validation.username,
      ...hashPassword(password),
      favorites: [],
    });
    writeJSON(usersFile, users);
    res.status(201).json({ message: 'User registered' });
  });

  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
    const normalizedUsername = typeof username === 'string' ? username.trim() : '';
    const users = readJSON(usersFile);
    const user = users.find(u => u.username === normalizedUsername && verifyPassword(password, u));
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    if (user.password) {
      Object.assign(user, removePlaintextPassword({
        ...user,
        ...hashPassword(password),
      }));
      writeJSON(usersFile, users);
    }

    const token = jwt.sign({ username: normalizedUsername }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, username: normalizedUsername });
  });

  return router;
}

module.exports = createAuthRouter;
