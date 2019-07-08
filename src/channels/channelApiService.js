'use strict';
const fetch = require('node-fetch');
const { YT_API_KEY } = require('../config');

const baseURL = 'https://www.googleapis.com/youtube/v3';

const ChannelApiService = {
  SearchChannels(searchterm) {
    return fetch(
      `${baseURL}/search?part=snippet&maxResults=20&order=relevance&q=${searchterm}&type=channel&key=${YT_API_KEY}`
    ).then(res => res.json());
  },

  SearchChannelsByTopic(searchterm, topic) {
    return fetch(
      `${baseURL}/search?part=snippet&maxResults=20&order=relevance&q=${searchterm}&topicId=${topic}&type=channel&key=${YT_API_KEY}`
    ).then(res => res.json());
  },

  ChannelDetails(channelId) {
    return fetch(
      `${baseURL}/channels?part=snippet%2Cstatistics%2CtopicDetails%2CbrandingSettings&id=${channelId}&maxResults=1&key=${YT_API_KEY}`
    ).then(res => res.json());
  }
};

module.exports = ChannelApiService;
