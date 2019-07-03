'use strict';
const express = require('express');
const ReviewsRouter = express.Router();

ReviewsRouter.get('/', (req, res) => {
  return res.json({ page: 'reviews' });
});

module.exports = ReviewsRouter;
