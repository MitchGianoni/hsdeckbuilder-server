const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { PORT, CLIENT_ORIGIN } = require('./config');
//const { dbConnect } = require('./db-mongoose');
const { dbConnect, dbGet } = require('./db-knex');
const knex = require('knex');

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.get('/api/cards', function (req, res, next) {
  dbGet().select('data').from('cards').where('id', 1)
    .then(result => {
      res.json(result);
    })
    .catch(err => next(err));
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
