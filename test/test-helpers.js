'use strict';
const knex = require('knex');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require('dotenv').config();

function getDB() {
  const db = knex({
    client: 'pg',
    connection: process.env.TEST_DB_URL
  });
  return db;
}

function clearTables(db) {
  return db.transaction(trx =>
    trx
      .raw(
        `TRUNCATE
        "channel",
        "channel_keyword",
        "channel_rating",
        "channel_topic",
        "favorite",
        "keyword",
        "review",
        "review_rating",
        "topic",
        "user"
      `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE channel_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE user_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE review_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE keyword_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE topic_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('channel_id_seq', 0)`),
          trx.raw(`SELECT setval('user_id_seq', 0)`),
          trx.raw(`SELECT setval('review_id_seq', 0)`),
          trx.raw(`SELECT setval('keyword_id_seq', 0)`),
          trx.raw(`SELECT setval('topic_id_seq', 0)`)
        ])
      )
  );
}

function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

function createUser(user, db) {
  return hashPassword(user.password).then(hashedPassword => {
    const hashedUser = {
      username: user.username,
      password: hashedPassword,
      name: user.name
    };
    return db
      .into('user')
      .insert(hashedUser)
      .then(() => db.raw(`SELECT setval('user_id_seq', 1)`));
  });
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256'
  });
  return `Bearer ${token}`;
}

module.exports = { getDB, clearTables, makeAuthHeader, createUser };
