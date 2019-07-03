'use strict';
const express = require('express');
const ChannelRouter = express.Router();

ChannelRouter.get('/', (req, res) => {
  return res.json({ page: 'channel' });
});

module.exports = ChannelRouter;
