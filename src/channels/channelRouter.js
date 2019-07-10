'use strict';
const express = require('express');
const ChannelRouter = express.Router();
const YoutubeApiService = require('../services/YoutubeApiService');
const ChannelService = require('./channel-service');
const jsonBodyParser = express.json();

const xss = require('xss');

ChannelRouter.route('/search').get(jsonBodyParser, async (req, res, next) => {
  try{
    let { search_term, ytapi } = req.body;
    search_term = xss(search_term).toLowerCase()
    if(ytapi){
      let results = await YoutubeApiService.SearchChannels(search_term)
      await ChannelService.insertOrUpdateChannels(
        req.app.get('db'),
        results.items
      )
      if(!results.length){
        res.status(204)
      }
      let resultsYtIds = results.items.map(channel => {
        return channel.id.channelId
      })
      await ChannelService.updateKeywords(
        req.app.get('db'),
        search_term
      )
      await ChannelService.insertOrUpdateChannelKeywords(
        req.app.get('db'),
        search_term,
        resultsYtIds
      )
      results = results.items.map(channel => {
        return ChannelService.serializeChannel(channel)
      })
      res.status(200).json({ data: results })
    }
    else{
      ChannelService.searchChannels(
        req.app.get('db'),
        search_term
      )
        .then(response => {
          res.status(200).json({ data: response })
        })
        .catch(error => next(error))
    }
  }
  catch(error){
    next(error)
  }
});

ChannelRouter.route('/search/topic').get(jsonBodyParser, async (req, res, next) => {
  // const { search_term, topicId } = req.body;
  // YoutubeApiService.SearchChannelsByTopic(search_term, topicId)
  //   .then(response => {
  //     res.status(200).json({ data: response });
  //   })
  //   .catch(error => next(error));
  try{
    let { search_term, topicId, ytapi } = req.body;
    search_term = xss(search_term).toLowerCase()
    topicId = xss(topicId)
    if(ytapi){
      let results = await YoutubeApiService.SearchChannelsByTopic(search_term, topicId)
      await ChannelService.insertOrUpdateChannels(
        req.app.get('db'),
        results.items
      )
      if(!results.length){
        res.status(204)
      }
      let resultsYtIds = results.items.map(channel => {
        return channel.id.channelId
      })
      await ChannelService.updateKeywords(
        req.app.get('db'),
        search_term
      )
      await ChannelService.insertOrUpdateChannelKeywords(
        req.app.get('db'),
        search_term,
        resultsYtIds
      )
      await ChannelService.insertOrUpdateChannelTopics(
        req.app.get('db'),
        topicId,
        resultsYtIds
      )
      results = results.items.map(channel => {
        return ChannelService.serializeChannel(channel)
      })
      res.status(200).json({ data: results })
    }
    else{
      ChannelService.searchChannelsByTopic(
        req.app.get('db'),
        search_term,
        topicId
      )
        .then(response => {
          res.status(200).json({ data: response })
        })
        .catch(error => next(error))
    }
  }
  catch(error){
    next(error)
  }
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