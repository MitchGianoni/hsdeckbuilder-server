const express = require('express');
const router = express.Router();
const { dbGet } = require('../db-knex');
const passport = require('passport');

// Use authentication
router.use('/', passport.authenticate('jwt', { session: false }));

// GET all decks
router.get('/', (req, res, next) => {
  dbGet().select('*').from('decks')
    .then(result => {
      res.json(result);
    })
    .catch(err => next(err));
});

// POST to Create a deck
router.post('/', (req, res, next) => {
  let { deckClass, deckName } = req.body;
  const requiredFields = ['deckName'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = new Error(`Missing '${missingField}' in request body`);
    err.status = 422;
    return next(err);
  }

  const stringFields = ['deckName'];
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

  const validClasses = ['DRUID', 'HUNTER', 'MAGE', 'PALADIN', 
    'PRIEST','ROGUE', 'SHAMAN', 'WARLOCK', 'WARRIOR'];
  const invalidClass = !validClasses.includes(req.body.deckClass);

  if (invalidClass) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Invalid class',
      location: invalidClass
    });
  }

  const newDeck = { /*user_id,*/ deckClass, deckName };

  dbGet().insert(newDeck).into('decks')
    .returning(['deckName', 'deckClass'])
    .then(([result]) => {
      res.status(201).json(result);
    })
    .catch(err => next(err));

});

// DELETE a deck
router.delete('/:deckId', (req, res, next) => {
  const deckId = req.params.deckId;

  dbGet().del().from('decks').where('id', deckId)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => { next(err); });
});

// ==============================================================

// GET all cards in a deck
router.get('/:deckId/cards', (req, res, next) => {
  const deckId = req.params.deckId;

  dbGet().select('*').from('cards_decks').where('deckId', deckId)
    .then(result => {
      res.json(result);
    })
    .catch(err => next(err));
});

// POST to add a card to a deck
router.post('/:deckId/cards', (req, res, next) => {
  const deckId = req.params.deckId;
  const cardId = req.body.cardId;

  const cardToAdd = { deckId, cardId }; 
  
  dbGet().insert(cardToAdd).into('cards_decks')
    .returning(['deckId', 'cardId'])
    .then(([result]) => {
      res.status(201).json(result);
    })
    .catch(err => next(err));
});

// DELETE a card from a deck
router.delete('/:deckId/cards/:cardId', (req, res, next) => {
  const { deckId, cardId } = req.params;

  dbGet().del().from('cards_decks').where('deck_id', deckId)
    .andWhere('card_id', cardId)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => { next(err); });
});



module.exports = router;