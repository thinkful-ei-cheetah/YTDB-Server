'use strict';
const express = require('express');
const UserRouter = express.Router();

UserRouter.get('/', (req, res) => {
  return res.json({ page: 'user' });
});

module.exports = UserRouter;
