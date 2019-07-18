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

describe('/API/CHANNELS endpoint', () => {
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

  const topicId = '/m/04rlf';

  before('set database connection and create user', async () => {
    db = getDB();
    app.set('db', db);
    await clearTables(db);
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

  const header = makeAuthHeader(user1);

  describe.only('/SEARCH/:SEARCH_TERM/:YTAPI', () => {
    it('GET should return 200', () => {
      return supertest(app)
        .get('/api/channels/search/fornite/true')
        .set({
          Authorization: header
        })
        .expect(200);
    });
  });

  describe.only('/SEARCH/:SEARCH_TERM/:YTAPI/TOPICID', () => {
    it('TOPICID GET should return 200', () => {
      return supertest(app)
        .get(`/api/channels/search/fornite/true/${encodeURIComponent(topicId)}`)
        .set({
          Authorization: header
        })
        .expect(200);
    });
  });

  describe.only('/:ID', () => {
    it('GET should return 200', () => {
      return supertest(app)
        .get(`/api/channels/UCh7EqOZt7EvO2osuKbIlpGg`)
        .set({
          Authorization: header
        })
        .expect(200);
    });
  });

  describe.only('/:ID/USERRATING', () => {
    it('GET should return 200', () => {
      return supertest(app)
        .get(`/api/channels/UCh7EqOZt7EvO2osuKbIlpGg/3`)
        .set({
          Authorization: header
        })
        .expect(200);
    });
  });
});
