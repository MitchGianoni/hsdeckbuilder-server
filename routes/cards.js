const express = require('express');
const router = express.Router();
const { dbGet } = require('../db-knex');
const passport = require('passport');

// Use authentication
router.use('/', passport.authenticate('jwt', { session: false }));

// GET all cards
router.get('/', (req, res, next) => {
  dbGet().select('*').from('cards')
    .then(result => {
      res.json(result);
    })
    .catch(err => next(err));
});

// GET card by ID (Each card object has an ID, use that)
router.get('/:id', (req, res, next) => {
  dbGet().first(dbGet().raw('*'))
    .whereRaw('data->>\'id\'=? ', [req.params.id])
    .from('cards')
    .then(result => {
      if(result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => { next(err); });
});

module.exports = router;