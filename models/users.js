const bcrypt = require('bcryptjs');

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

function validatePassword(password) {
  return password === this.password;
}

module.exports = hashPassword, validatePassword;

