'use strict';
const axios = require('axios');
const { YT_API_KEY } = require('../config');

const baseURL = 'https://www.googleapis.com/youtube/v3';

const ChannelApiService = {
  SearchChannels(searchterm) {
    return axios
      .get(`${baseURL}/search?`, {
        params: {
          part: 'snippet',
          maxResults: '20',
          order: 'relevance',
          q: searchterm,
          type: 'channel',
          key: YT_API_KEY
        },
        headers: {
          Accept: 'application/json'
        }
      })
      .then(res => res.data);
  },
  SearchChannelsByTopic(searchterm, topic) {
    return axios
      .get(`${baseURL}/search?`, {
        params: {
          part: 'snippet',
          maxResults: '20',
          order: 'relevance',
          q: searchterm,
          topId: topic,
          type: 'channel',
          key: YT_API_KEY
        },
        headers: {
          Accept: 'application/json'
        }
      })
      .then(res => res.data);
  },

  ChannelDetails(channelId) {
    return axios
      .get(
        `${baseURL}/channels?part=snippet%2Cstatistics%2CtopicDetails%2CbrandingSettings&id=${channelId}&maxResults=1&key=${YT_API_KEY}`
      )
      .then(res => res.data);
  }
};

module.exports = ChannelApiService;
