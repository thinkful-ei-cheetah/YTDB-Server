'use strict';
const app = require('../src/app');
require('dotenv').config();
const {
  getDB,
  clearTables,
  makeAuthHeader,
  createUser,
  createChannel
} = require('./test-helpers');

describe('/API/RATING endpoint', () => {
  let db;
  const user = {
    username: 'testuser',
    password: 'testuserpassword',
    name: 'testuser'
  };

  const channel = {
    id: 1,
    title: 'SypherPK',
    yt_id: 'UC_q5WZtFp36adwqhKpZzxwQ',
    thumbnail:
      'https://yt3.ggpht.com/-bXqW6gG9I_Q/AAAAAAAAAAI/AAAAAAAAAAA/vVJx0OT-uMY/s88-c-k-no-mo-rj-c0xffffff/photo.jpg',
    description:
      'Hey everyone! My name is Sypher and I make pro level gameplay videos. Currently, I play only Fortnite! Subscribe to my channel for pro level gameplay and pro ...',
    rating_total: 0,
    rating_count: 0,
    date_updated: '2019-07-16T20:25:38.466Z',
    total_videos: '942',
    subscriber_count: '1780907',
    view_count: '200132571',
    comment_count: '0'
  };

  before('set database connection and create user', async () => {
    db = getDB();
    app.set('db', db);
    await clearTables(db);
    await createChannel(db, channel);
    return createUser(user, db);
  });

  after('disconnect from db', () => {
    return clearTables(db).then(() => {
      return db.destroy();
    });
  });

  const user1 = {
    username: 'testuser',
    password: 'testuserpassword',
    name: 'testuser',
    id: 1
  };

  const rating = {
    rating: 4,
    channelId: 1
  };

  const header = makeAuthHeader(user1);

  describe('/ ENDPOINT', () => {
    it('POST should return 201', () => {
      return supertest(app)
        .post('/api/rating')
        .set({
          Authorization: header
        })
        .send(rating)
        .expect(201);
    });

    it('/:id GET should return 200', () => {
      return supertest(app)
        .get(`/api/rating/1`)
        .set({
          Authorization: header
        })
        .expect(200)
        .then(response => {});
    });
  });
});
