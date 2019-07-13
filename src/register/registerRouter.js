'use strict';
const express = require('express');
const RegisterRouter = express.Router();
const jsonBodyParser = express.json();
const path = require('path');
const RegisterService = require('./register-service');

RegisterRouter.post('/', jsonBodyParser, async (req, res, next) => {
  let { name, username, password } = req.body;

  for (const field of ['name', 'username', 'password']) {
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });
  }

  try {
    // const passwordError = RegisterService.validatePassword(password);

    // if (passwordError) {
    //   return res.status(400).json({ error: passwordError });
    // }

    const hasUserWithUserName = await RegisterService.hasUserWithUserName(
      req.app.get('db'),
      username
    );

    if (hasUserWithUserName)
      return res.status(400).json({ error: `Username already taken` });

    const hashedPassword = await RegisterService.hashPassword(password);

    const newUser = {
      username,
      password: hashedPassword,
      name
    };

    const user = await RegisterService.saveUser(req.app.get('db'), newUser);

    res
      .status(201)
      .location(path.posix.join(req.originalUrl, `/${user.id}`))
      .json({ message: `Registation successful for ${user}` });
  } catch (error) {
    next(error);
  }
});

module.exports = RegisterRouter;
