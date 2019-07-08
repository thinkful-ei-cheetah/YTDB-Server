'use strict';
const express = require('express');
const ChannelRouter = express.Router();
const ChannelApiService = require('./channelApiService');
const jsonBodyParser = express.json();

ChannelRouter.route('/').get(jsonBodyParser, (req, res, next) => {
  const { search_term } = req.body;

  ChannelApiService.SearchChannels(search_term)
    .then(response => {
      res.status(200).json({ data: response });
    })
    .catch(error => next(error));
});

ChannelRouter.route('/topic').get(jsonBodyParser, (req, res, next) => {
  const { search_term, topicId } = req.body;

  ChannelApiService.SearchChannelsByTopic(search_term, topicId)
    .then(response => {
      res.status(200).json({ data: response });
    })
    .catch(error => next(error));
});

ChannelRouter.route('/:id').get(jsonBodyParser, (req, res, next) => {
  const { id } = req.params;

  ChannelApiService.ChannelDetails(id)
    .then(response => {
      res.status(200).json({ data: response });
    })
    .catch(error => next(error));
});

module.exports = ChannelRouter;
