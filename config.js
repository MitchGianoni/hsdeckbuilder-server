require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || process.env.CLIENT_ORIGIN2 || 'http://localhost:3000',
  DATABASE_URL:
      process.env.DATABASE_URL || 'postgres://localhost/deckbuilder',
  TEST_DATABASE_URL:
      process.env.TEST_DATABASE_URL ||
      'postgres://localhost/deckbuilder-test',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d'
};
