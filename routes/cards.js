const express = require('express');
const router = express.Router();
const { dbGet } = require('../db-knex');
const passport = require('passport');
const bypassAuth = passport.authenticate('bypasstoken');

// GET random card!
router.get('/random', (req, res, next) => {
  dbGet().select('*').from('cards')
    .orderBy(dbGet().raw('RANDOM()'))
    .limit(2)
    .then(result => {
      res.json(result);
    });
});

// Use authentication
router.use('/', passport.authenticate('jwt', { session: false }));

// GET all cards
router.get('/', (req, res, next) => {
  dbGet().select('*').from('cards').orderBy('name', 'asc')
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