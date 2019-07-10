'use strict';
const FavoriteService = {
  addFavorite(knex, user_id, channel_id) {
    return knex
      .insert({ user_id, channel_id })
      .into('favorite')
      .returning('*');
  }
};

module.exports = FavoriteService;
