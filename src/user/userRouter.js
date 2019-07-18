'use strict';
const express = require('express');
const UserRouter = express.Router();
const { requireAuth } = require('../middleware/jwt-auth');

const jsonBodyParser = express.json();
const UserService = require('./userService');

UserRouter.route('/').get(requireAuth, async (req, res) => {
  console.log('user id =====>', req.user.id);
  let userInfo = await UserService.getUserById(req.app.get('db'), req.user.id);
  if (!userInfo) {
    return res.status(400).json({
      error: 'User does not existy'
    });
  }
  return res.json(userInfo);
});

// ChannelRouter.route('/:id/userrating').get(requireAuth, async (req, res, next) => {
//   try {
//     let { id } = req.params;
//     id = parseInt(id, 10)
//     console.log('channel id =====>', id)
//     console.log('user id =====>', req.user.id)
//     let userRating = await ChannelService.getUserRating(
//       req.app.get('db'),
//       req.user.id,
//       id
//     )
//     console.log('userRating ====>', userRating)
//     if(userRating === undefined){
//       userRating = {rating: 0}
//     }
//     res.status(200).json(userRating)
//   }
//   catch(error){
//     next(error)
//   }
// });

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
      console.log('dbUser ======>', dbUser);
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
          user: {
            id: dbUser.id,
            name: dbUser.name,
            type: dbUser.type,
            username: dbUser.username
          }
        });
      });
    })
    .catch(next);
});

module.exports = UserRouter;
