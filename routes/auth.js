const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY } = require('../config');
const options = { session: false };
const localAuth = passport.authenticate('local', options);

const createAuthToken = user => {
  return jwt.sign({user}, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

// Use JWT AUTH
const jwtAuth = passport.authenticate('jwt', { session: false  });

// LOGIN endpoint!
router.post('/', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  return res.json({ authToken });
});

// Refresh endpoint
router.post('/api/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

module.exports = router;