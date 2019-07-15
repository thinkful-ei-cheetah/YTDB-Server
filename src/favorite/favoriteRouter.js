'use strict';
const express = require('express');
const FavoriteRouter = express.Router();
const FavoriteService = require('./favoriteService');
const jsonBodyParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');

FavoriteRouter.route('/')
  .all(requireAuth)
  .post(jsonBodyParser, async (req, res, next) => {
    const { yt_id } = req.body;

    for (const field of ['yt_id']) {
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });
    }

    let channelId = await FavoriteService.findChannelByYoutubeId(
      req.app.get('db'),
      yt_id
    );
    console.log(channelId);

    FavoriteService.addFavorite(req.app.get('db'), req.user.id, channelId.id)
      .then(favorite => {
        res.status(201).json(favorite[0]);
      })
      .catch(error => next(error));
  })
  .get((req, res, next) => {
    FavoriteService.getFavorites(req.app.get('db'), req.user.id)
      .then(favorites => {
        res.status(200).json(favorites);
      })
      .catch(error => next(error));
  })
  .delete(jsonBodyParser, async (req, res, next) => {
    const { yt_id } = req.body;

    for (const field of ['yt_id']) {
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });
    }

    let channelId = await FavoriteService.findChannelByYoutubeId(
      req.app.get('db'),
      yt_id
    );

    FavoriteService.deleteFavorites(req.app.get('db'), req.user.id, channelId.id)
      .then(favorites => {
        res.status(200).json(favorites[0]);
      })
      .catch(error => next(error));
  });

module.exports = FavoriteRouter;
