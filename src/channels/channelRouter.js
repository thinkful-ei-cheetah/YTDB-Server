'use strict';
const express = require('express');
const ChannelRouter = express.Router();
const YoutubeApiService = require('../services/YoutubeApiService');
const ChannelService = require('./channel-service');
const jsonBodyParser = express.json();

const xss = require('xss');

ChannelRouter.route('/search/:search_term/:ytapi').get(async (req, res, next) => {
  try{
    let { search_term, ytapi } = req.params;
    search_term = xss(search_term).toLowerCase()
    if(ytapi === 'true'){
      let results = await YoutubeApiService.SearchChannels(search_term)
      if(results.hasOwnProperty('error')){
        // res.status(403)
        res.status(200).json({ data: [] })
      }
      else{
        await ChannelService.insertOrUpdateChannels(
          req.app.get('db'),
          results.items
        )
        try {
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
        }
        finally {
          results = results.items.map(channel => {
            return ChannelService.serializeChannel(channel)
          })
          res.status(200).json({ data: results })
        }
      }
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

ChannelRouter.route('/search/:search_term/:ytapi/:topicId').get(async (req, res, next) => {
  // const { search_term, topicId } = req.body;
  // YoutubeApiService.SearchChannelsByTopic(search_term, topicId)
  //   .then(response => {
  //     res.status(200).json({ data: response });
  //   })
  //   .catch(error => next(error));
  try{
    let { search_term, topicId, ytapi } = req.params;
    search_term = xss(search_term).toLowerCase()
    topicId = xss(decodeURIComponent(topicId))
    if(ytapi === 'true'){
      let results = await YoutubeApiService.SearchChannelsByTopic(search_term, topicId)
      if(results.hasOwnProperty('error')){
        // res.status(403)
        res.status(200).json({ data: [] })
      }
      else {
        await ChannelService.insertOrUpdateChannels(
          req.app.get('db'),
          results.items
        )
        try {
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
        }
        finally {
          results = results.items.map(channel => {
            return ChannelService.serializeChannel(channel)
          })
          res.status(200).json({ data: results })
        }
      }
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