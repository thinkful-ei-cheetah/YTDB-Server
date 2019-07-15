'use strict';
const FavoriteService = {
  addFavorite(knex, user_id, channel_id) {
    return knex
      .insert({ user_id, channel_id })
      .into('favorite')
      .returning('*');
  },

  getFavorites(knex, user_id) {
    // return knex('favorite')
    //   .where({ user_id })
    //   .join('channel', 'favorite.channel_id', '=', 'channel.id')
    //   .select('channel.id', 'channel.title', 'channel.thumbnail')
    //   .then(favorites => favorites);

    return knex
      .select('channel.id', 'channel.title', 'channel.thumbnail')
      .from('favorite')
      .leftJoin('channel', 'favorite.channel_id', 'channel.id')
      .where({ user_id });
  },

  deleteFavorites(knex, user_id, channel_id) {
    return knex('favorite')
      .where({
        'favorite.user_id': user_id,
        'favorite.channel_id': channel_id
      })
      .del()
      .returning('*');
  },

  findChannelByYoutubeId(knex, yt_id) {
    return knex('channel')
      .select('id')
      .where({ yt_id })
      .first();
  }
};

module.exports = FavoriteService;
