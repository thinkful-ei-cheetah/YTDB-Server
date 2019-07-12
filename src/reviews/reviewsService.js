('use strict');

const ReviewsService = {
  addReview(knex, user_id, text, yt_id, total_likes, total_dislikes) {
    var query = knex
      .select('*')
      .from('channel')
      .where('yt_id', yt_id);

    return query.then((res) => {
      let channel_id;
      if (res[0].id) {
        channel_id = res[0].id;
      }
      if(channel_id) {
        return knex
          .insert({ user_id, text, channel_id, total_likes, total_dislikes })
          .into('review')
          .returning('*');
      } else
      {
        return;
      }
    });  
  },

  getChannelReviews(knex, channel_id) {
    var query = knex
      .select('*')
      .from('channel')
      .where('yt_id', channel_id);

    return query.then((res) => {
      if(res[0].id) {
        return knex
          .select('*')
          .from('review')
          .where('id', res[0].id);
      } else
      {
        return;
      }
    });
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
