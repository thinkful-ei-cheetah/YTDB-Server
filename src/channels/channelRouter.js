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
    console.log(search_term, ytapi)
    if(ytapi){
      let results = await YoutubeApiService.SearchChannels(search_term)
      // const results = await Promise.all(your_promises)
      // const filtered_results = results.filter(res => {})
      // let newChannels = results.items.filter(channel => {
      //   // console.log(channel.snippet.channelTitle)
      //   let temp = ChannelService.channelExisty(
      //     req.app.get('db'),
      //     channel.snippet.channelId
      //   )
      //   console.log(temp)
      //   return temp
      // })
      // console.log('newChannels', newChannels.length)
      await ChannelService.insertOrUpdateChannels(
        req.app.get('db'),
        results.items
      )
      res.status(200).json({ data: results.items })
      // YoutubeApiService.SearchChannels(search_term)
      // .then(response => {
      //   // console.log(response.items[0])
      //   return response.items.map(channel => {
      //     return channel
      //   })
      // })
      // .then(response => {
      //   res.status(200).json({ data: response });
      // })
      // .catch(error => next(error));
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