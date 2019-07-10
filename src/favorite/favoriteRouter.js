'use strict';
const express = require('express');
const FavoriteRouter = express.Router();
const FavoriteService = require('./favoriteService');
const jsonBodyParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');

FavoriteRouter.post('/', requireAuth, jsonBodyParser, (req, res, next) => {
  const { channelId } = req.body;

  for (const field of ['channelId']) {
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });
  }

  FavoriteService.addFavorite(req.app.get('db'), req.user.id, channelId)
    .then(favorite => {
      res.status(201).json(favorite[0]);
    })
    .catch(error => next(error));
});

module.exports = FavoriteRouter;
