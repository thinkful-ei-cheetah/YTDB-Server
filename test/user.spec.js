'use strict';
const app = require('../src/app');
const {
  getDB,
  createUser,
  clearTables,
  makeAuthHeader
} = require('./test-helpers');

describe('/API/USER endpoint', () => {
  let db;
  const user = {
    username: 'testuser',
    password: 'testuserpassword',
    name: 'testuser'
  };

  before('set database connection and create user', () => {
    db = getDB();
    app.set('db', db);
    clearTables(db);
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

  it('POST should return 200 with credentials', () => {
    return supertest(app)
      .post('/api/user')
      .send(user)
      .expect(200);
  });

  it('GET should return 200', () => {
    return supertest(app)
      .get('/api/user')
      .set({
        Authorization: header
      })
      .expect(200);
  });
});
