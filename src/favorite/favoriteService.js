'use strict';
const FavoriteService = {
  addFavorite(knex, user_id, channel_id) {
    return knex
      .insert({ user_id, channel_id })
      .into('favorite')
      .returning('*');
  },

  getFavorites(knex, user_id) {
    return knex('favorite')
      .where({ user_id })
      .join('channel', 'favorite.channel_id', '=', 'channel.id')
      .select('channel.id', 'channel.title', 'channel.thumbnail')
      .then(favorites => favorites);
  }
};

module.exports = FavoriteService;
