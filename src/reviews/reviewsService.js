('use strict');

const ReviewsService = {
  addReview(knex, user_id, text, channel_id, total_likes, total_dislikes) {
    return knex
      .insert({ user_id, text, channel_id, total_likes, total_dislikes })
      .into('review')
      .returning('*');
  },

  rateReview(knex, user_id, review_id, opinion) {
    if (opinion) {
      return knex
        .insert({ user_id, review_id, like: true })
        .into('review_rating')
        .returning('*')
        .then(response => {
          return knex('review')
            .where('id', '=', response[0].review_id)
            .increment('total_likes', 1)
            .update('date_updated', knex.fn.now())
            .returning('*');
        });
    } else {
      return knex
        .insert({ user_id, review_id, like: false })
        .into('review_rating')
        .returning('*')
        .then(response => {
          console.log(response);
          return knex('review')
            .where('id', '=', response[0].review_id)
            .update('date_updated', knex.fn.now())
            .increment('total_dislikes', 1)
            .returning('*');
        });
    }
  }
};

module.exports = ReviewsService;