'use strict';

const ChannelRatingService = {
  addUserRating(knex, id, channelId, rating) {
    return knex
      .insert({ user_id: id, channel_id: channelId, rating })
      .into('channel_rating')
      .returning('*');
  }
};

module.exports = ChannelRatingService;
