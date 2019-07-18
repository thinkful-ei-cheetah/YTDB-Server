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
  const token = jwt.sign({ id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256'
  });
  return `Bearer ${token}`;
}

function createChannel(db, channel) {
  return db
    .into('channel')
    .insert(channel)
    .returning('*');
}

function populateTopicTable(db) {
  return db.transaction(trx =>
    trx.raw(`INSERT INTO "topic" ("id", "titleId", "title")
  VALUES
    (1, '/m/04rlf', 'Music'),
    (2, '/m/02mscn', 'Christian music'),
    (3, '/m/0ggq0m', 'Classical music'),
    (4, '/m/01lyv', 'Country music'),
    (5, '/m/02lkt', 'Electronic music'),
    (6, '/m/0glt670', 'Hip hop music'),
    (7, '/m/05rwpb', 'Independent music'),
    (8, '/m/03_d0', 'Jazz'),
    (9, '/m/028sqc', 'Music of Asia'),
    (10, '/m/0g293', 'Music of Latin America'),
    (11, '/m/064t9', 'Pop music'),
    (12, '/m/06cqb', 'Reggae'),
    (13, '/m/06j6l', 'Rhythm and blues'),
    (14, '/m/06by7', 'Rock music'),
    (15, '/m/0gywn', 'Soul music'),
    (16, '/m/0bzvm2', 'Gaming'),
    (17, '/m/025zzc', 'Action game'),
    (18, '/m/02ntfj', 'Action-adventure game'),
    (19, '/m/0b1vjn', 'Casual game'),
    (20, '/m/02hygl', 'Music video game'),
    (21, '/m/04q1x3q', 'Puzzle video game'),
    (22, '/m/01sjng', 'Racing video game'),
    (23, '/m/0403l3g', 'Role-playing video game'),
    (24, '/m/021bp2', 'Simulation video game'),
    (25, '/m/022dc6', 'Sports game'),
    (26, '/m/03hf_rm', 'Strategy video game'),
    (27, '/m/06ntj', 'Sports'),
    (28, '/m/0jm_', 'American football'),
    (29, '/m/018jz', 'Baseball'),
    (30, '/m/018w8', 'Basketball'),
    (31, '/m/01cgz', 'Boxing'),
    (32, '/m/09xp_', 'Cricket'),
    (33, '/m/02vx4', 'Football'),
    (34, '/m/037hz', 'Golf'),
    (35, '/m/03tmr', 'Ice hockey'),
    (36, '/m/01h7lh', 'Mixed martial arts'),
    (37, '/m/0410tth', 'Motorsport'),
    (38, '/m/07bs0', 'Tennis'),
    (39, '/m/07_53', 'Volleyball'),
    (40, '/m/02jjt', 'Entertainment'),
    (41, '/m/09kqc', 'Humor'),
    (42, '/m/02vxn', 'Movies'),
    (43, '/m/05qjc', 'Performing arts'),
    (44, '/m/066wd', 'Professional wrestling'),
    (45, '/m/0f2f9', 'TV shows'),
    (46, '/m/019_rr', 'Lifestyle'),
    (47, '/m/032tl', 'Fashion'),
    (48, '/m/027x7n', 'Fitness'),
    (49, '/m/02wbm', 'Food'),
    (50, '/m/03glg', 'Hobby'),
    (51, '/m/068hy', 'Pets'),
    (52, '/m/041xxh', 'Physical attractiveness'),
    (53, '/m/07c1v', 'Technology'),
    (54, '/m/07bxq', 'Tourism'),
    (55, '/m/07yv9', 'Vehicles'),
    (56, '/m/098wr', 'Society'),
    (57, '/m/09s1f', 'Business'),
    (58, '/m/0kt51', 'Health'),
    (59, '/m/01h6rj', 'Military'),
    (60, '/m/05qt0', 'Politics'),
    (61, '/m/06bvp', 'Religion'),
    (62, '/m/01k8wb', 'Knowledge');`)
  );
}

function createUserRating(db, id, channel_id, rating) {
  return db.insert({ user_id: id, channel_id, rating }).into('channel_rating');
}

module.exports = {
  getDB,
  clearTables,
  makeAuthHeader,
  createUser,
  createChannel,
  populateTopicTable,
  createUserRating
};
