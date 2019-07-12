'use strict';
const express = require('express');
const ReviewsRouter = express.Router();
const jsonBodyParser = express.json();
const ReviewsService = require('./reviewsService');
const { requireAuth } = require('../middleware/jwt-auth');
const xss = require('xss')

ReviewsRouter.get('/', (req, res) => {
  return res.json({ page: 'reviews' });
});


ReviewsRouter.route('/:id').get(async (req, res, next) => {
    const  ytapi_id  = req.params.id;
   // const ytapi_id = xss(id);

    ReviewsService.getChannelReviews(
      req.app.get('db'),
      ytapi_id
    )
    .then(response => {
      res.status(201).json({ response });
    })
    .catch(error => next(error));
});

ReviewsRouter.post('/', requireAuth, jsonBodyParser, (req, res, next) => {
  const { text, channelId } = req.body;
  const total_likes = 0;
  const total_dislikes = 0;

  for (const field of ['text', 'channelId']) {
    if (!req.body[field])
      return res
        .status(400)
        .json({ error: `Missing ${field} in request body` });
  }

  ReviewsService.addReview(
    req.app.get('db'),
    req.user.id,
    text,
    channelId,
    total_likes,
    total_dislikes
  )
    .then(response => {
      res.status(201).json({ response: response[0].text });
    })
    .catch(error => next(error));
});

ReviewsRouter.post('/rating', requireAuth, jsonBodyParser, (req, res, next) => {
  const { opinion, reviewId } = req.body;
  for (const field of ['opinion']) {
    if (!req.body[field])
      return res
        .status(400)
        .json({ error: `Missing ${field} in request body` });
  }

  ReviewsService.rateReview(req.app.get('db'), req.user.id, reviewId, opinion)
    .then(response => {
      res.status(201).json({ response });
    })
    .catch(error => next(error));
});

module.exports = ReviewsRouter;
