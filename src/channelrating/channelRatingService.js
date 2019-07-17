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
  },

  checkUserRating(db, user_id, channel_id){
    return db
      .from('channel_rating')
      .select('*')
      .where({ user_id, channel_id })
  },

  updateUserRating(db, user_id, channel_id, newRating, oldRating){
    return db.transaction(async trx => {
      await trx('channel_rating')
        .where({user_id, channel_id})
        .update('rating', newRating)
      let ratingDiff = newRating - oldRating
      console.log('ratingDiff ======>', ratingDiff)

      let ratingTotal = await trx('channel')
        .select('rating_total')
        .where('id', channel_id)
        .first()
      console.log('ratingTotal ====>', ratingTotal)
      if(ratingDiff > 0){
        await trx('channel')
          .increment('rating_total', ratingDiff)
          .where('id', channel_id)
      }

      else{
        await trx('channel')
          .decrement('rating_total', Math.abs(ratingDiff))
          .where('id', channel_id)
      }
      
      let newRatingTotal = await trx('channel')
        .select('rating_total')
        .where('id', channel_id)
        .first()
      
      console.log('newRatingTotal ====>', newRatingTotal)
    })
  },

  getUserRating(knex, user_id, channel_id) {
    return knex('channel_rating')
      .first('rating')
      .where({ user_id, channel_id })
      .then(response => {
        return response;
      });
  }
};

module.exports = ChannelRatingService;
