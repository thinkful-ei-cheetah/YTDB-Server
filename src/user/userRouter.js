'use strict';
const express = require('express');
const UserRouter = express.Router();

const jsonBodyParser = express.json();
const UserService = require('./userService');

UserRouter.get('/', (req, res) => {
  return res.json({ page: 'user' });
});

UserRouter.post('/', jsonBodyParser, (req, res, next) => {
  const { username, password } = req.body;
  const loginUser = { username, password };

  for (const field of ['username', 'password']) {
    if (!req.body[field])
      return res
        .status(400)
        .json({ error: `Missing ${field} in request body` });
  }

  UserService.getUserWithUserName(req.app.get('db'), loginUser.username)
    .then(dbUser => {
      if (!dbUser)
        return res.status(400).json({
          error: 'Incorrect Username or Password'
        });

      return UserService.comparePasswords(
        loginUser.password,
        dbUser.password
      ).then(compareMatch => {
        if (!compareMatch)
          return res.status(400).json({
            error: 'Incorrect Username or password'
          });

        const sub = dbUser.username;
        const payload = { id: dbUser.id };
        res.status(200).json({
          authToken: UserService.createJwt(sub, payload),
          name: dbUser.name
        });
      });
    })
    .catch(next);
});

module.exports = UserRouter;
