'use strict';
const express = require('express');
const ChannelRatingRouter = express.Router();
const jsonBodyParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');
const ChannelRatingService = require('./channelRatingService');

ChannelRatingRouter.route('/')
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { rating, channelId } = req.body;

    for (const field of ['rating', 'channelId']) {
      if (!req.body[field])
        return res
          .status(400)
          .json({ error: `Missing ${field} in request body` });
    }

    ChannelRatingService.addUserRating(
      req.app.get('db'),
      req.user.id,
      channelId,
      rating
    )
      .then(response => {
        res.status(201).json({ rating: response[0].rating });
      })
      .catch(error => next(error));
  })
  .get(jsonBodyParser, (req, res, next) => {
    res.json({ hello: 'this workds' });
  });

module.exports = ChannelRatingRouter;
