'use strict';
const express = require('express');
const ChannelRouter = express.Router();
const YoutubeApiService = require('../services/YoutubeApiService');
const jsonBodyParser = express.json();

ChannelRouter.route('/search').get(jsonBodyParser, (req, res, next) => {
  const { search_term } = req.body;

  YoutubeApiService.SearchChannels(search_term)
    .then(response => {
      res.status(200).json({ data: response });
    })
    .catch(error => next(error));
});

ChannelRouter.route('/search/topic').get(jsonBodyParser, (req, res, next) => {
  const { search_term, topicId } = req.body;

  YoutubeApiService.SearchChannelsByTopic(search_term, topicId)
    .then(response => {
      res.status(200).json({ data: response });
    })
    .catch(error => next(error));
});

ChannelRouter.route('/:id').get((req, res, next) => {
  const { id } = req.params;

  YoutubeApiService.ChannelDetails(id)
    .then(response => {
      res.status(200).json({ data: response });
    })
    .catch(error => next(error));
});

module.exports = ChannelRouter;
