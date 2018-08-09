const express = require('express');
const router = express.Router();
const { dbGet } = require('../db-knex');

router.get('/', (req, res, next) => {
  dbGet().select('data').from('cards')
    .then(result => {
      res.json(result);
    })
    .catch(err => next(err));
});

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