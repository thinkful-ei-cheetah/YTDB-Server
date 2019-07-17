'use strict';
const express = require('express');
const ChannelRatingRouter = express.Router();
const jsonBodyParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');
const ChannelRatingService = require('./channelRatingService');

ChannelRatingRouter.route('/').post(
  requireAuth,
  jsonBodyParser,
  async (req, res, next) => {
    const { rating, channelId } = req.body;

    for (const field of ['rating', 'channelId']) {
      if (!req.body[field])
        return res
          .status(400)
          .json({ error: `Missing ${field} in request body` });
    }

    let existy = await ChannelRatingService.checkUserRating(
      req.app.get('db'),
      req.user.id,
      channelId
    )
    console.log('existy =====>', existy)
    
    if(existy.length){
      console.log('user rating already existy')
      let ratingDiff = rating - existy[0].rating
      if(ratingDiff > 0 || ratingDiff < 0){
        console.log(`there is a difference in rating of "${ratingDiff}"`)
        await ChannelRatingService.updateUserRating(
          req.app.get('db'),
          req.user.id,
          channelId,
          rating,
          existy[0].rating
        )
        res.status(201).json({ rating: rating });
      }
      else{
        console.log('no difference in rating, returning rating')
        res.status(201).json({ rating: rating });
      }
    }
    else{
      console.log('user rating does not existy')
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
    }
  }
);

ChannelRatingRouter.route('/:id').get(requireAuth, (req, res, next) => {
  const { id } = req.params;

  ChannelRatingService.getUserRating(req.app.get('db'), req.user.id, id)
    .then(response => {
      res.status(200).json({ rating: response.rating });
    })
    .catch(error => next(error));
});

module.exports = ChannelRatingRouter;
