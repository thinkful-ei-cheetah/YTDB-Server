'use strict';

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;
const bcrypt = require('bcryptjs');

const RegisterService = {
  hasUserWithUserName(knex, username) {
    return knex('user')
      .where({ username: username })
      .first()
      .then(user => !!user);
  },

  saveUser(knex, newUser) {
    return knex('user')
      .insert({
        username: newUser.username,
        password: newUser.password,
        name: newUser.name
      })
      .into('user')
      .returning('*')
      .then(([user]) => user);
  },

  validatePassword(password) {
    if (password.length < 8) {
      return 'Password be longer than 8 characters';
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character';
    }
    return null;
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12);
  }
};

module.exports = RegisterService;
