const bcrypt = require('bcryptjs');

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

module.exports = hashPassword;