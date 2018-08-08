const express = require('express');
const router = express.Router();
const { dbGet } = require('../db-knex');
const emailValidator = require('email-validator');
const hashPassword = require('../models/users');

// GET all users
router.get('/', (req, res, next) => {
  dbGet().select('id', 'username', 'email')
    .from('users')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

// GET user by ID
router.get('/:id', (req, res, next) => {
  const {id} = req.params;
  dbGet().select('id', 'username', 'email')
    .from('users').where('id', id)
    .then(([user]) => {
      if(user) {
        res.json(user);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

// POST to Create a user
router.post('/', (req, res, next) => {
  let { username, password, email } = req.body;
  const requiredFields = ['username', 'password', 'email'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = new Error(`Missing '${missingField}' in request body`);
    err.status = 422;
    return next(err);
  }

  const stringFields = ['username', 'password'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  const explicitlyTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicitlyTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 5
    },
    password: {
      min: 8,
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field => 'min' in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min);
  const tooLargeField = Object.keys(sizedFields).find(
    field => 'max' in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max);

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  const validEmail = (!emailValidator.validate(email));

  if (validEmail) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Not a valid email address',
      location: validEmail
    });
  }

  dbGet().select()
    .from('users').count('username').where('username', username)
    .then(([_count]) => {
      const { count } = _count;
      console.log('Count', count);
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      return hashPassword(password, 10);
    })
    .then(hash => {
      const newUser = {
        username,
        password: hash,
        email
      };
      return dbGet().insert(newUser).select('users').into('users')
        .returning(['username', 'id'])
        .then(([result]) => {
          res.status(201).json(result);
        })
        .catch(err => next(err));
    }).catch(err => next(err));

});

module.exports = router;