'use strict';
const express = require('express');
const RegisterRouter = express.Router();

RegisterRouter.get('/', (req, res) => {
  return res.json({ page: 'register' });
});

module.exports = RegisterRouter;
