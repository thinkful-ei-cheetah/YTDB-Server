'use strict';

const ChannelRatingService = {
  addUserRating(knex, id, channelId, rating) {
    return knex
      .insert({ user_id: id, channel_id: channelId, rating })
      .into('channel_rating')
      .returning('*')
      .then(response => {
        console.log(response);
        return knex('channel')
          .where('id', '=', response[0].channel_id)
          .increment({
            rating_count: 1,
            rating_total: response[0].rating
          })
          .returning('*');
      });
  }
};

//do plus equals to total and incrmeent count

module.exports = ChannelRatingService;
