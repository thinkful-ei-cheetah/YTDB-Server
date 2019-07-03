'use strict';

module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  YT_API_KEY: process.env.YT_API_KEY
};
