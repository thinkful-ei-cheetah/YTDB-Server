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

ChannelRouter.route('/:id').get( async (req, res, next) => {
  try {
    const { id } = req.params;

    let whatWeHave = await ChannelService.dirtyDetails( req.app.get('db'), id )
    console.log(whatWeHave)
    let now = new Date()
    let timeDiff = now.getTime() - whatWeHave.date_updated.getTime()
    if ((timeDiff > 86400000) || (whatWeHave.subscriber_count === null)){
      console.log('MAKE YOUTUBE API CALL!!!!!!!!')
      let dirtyDetails = await YoutubeApiService.ChannelDetails(id)
      let topics = dirtyDetails.items[0].topicDetails.topicIds
      console.log('dirtyDetails topicDetails ========>', topics)
      let keywords = dirtyDetails.items[0].brandingSettings.channel.keywords.replace(/['"“＂〃ˮײ″״‶˶]/g, "")
      keywords = keywords.split(' ')
      console.log('dirtyDetails brandingSettings ========>', keywords)

      await ChannelService.inputDirtyDetails(
        req.app.get('db'), 
        id,
        dirtyDetails.items[0].statistics
      )

      for(let i = 0; i < topics.length; i++){
        await ChannelService.insertOrUpdateChannelTopics(
          req.app.get('db'),
          topics[i],
          [{yt_id: id}]
        )
      }

      res.status(200).json({ data: dirtyDetails });
    }
    else {
      console.log('MAKE OUR API CALL!!!!!!!!')
      let keywords = await ChannelService.myKeywords( req.app.get('db'), whatWeHave.id )
      let topics = await ChannelService.myTopics( req.app.get('db'), whatWeHave.id )
      keywords = keywords.map(keyword => keyword.title)
      topics = topics.map(topic => topic.title)
      console.log('keywords =====>', keywords)
      console.log('topics   =====>', topics)
      whatWeHave.keywords = keywords
      whatWeHave.topics = topics
      console.log('whatWeHave ======>', whatWeHave)

      res.status(200).json({ data: whatWeHave })
    }
  }
  catch(error){
    next(error)
  }
});

module.exports = ChannelRouter;