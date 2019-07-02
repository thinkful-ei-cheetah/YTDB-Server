'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const registerRouter = require('./register/registerRouter');
const reviewsRouter = require('./reviews/reviewsRouter');
const channelRouter = require('./channels/channelRouter');
const dashboardRouter = require('./dashboard/dashboardRouter');
const userRouter = require('./user/userRouter');

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

const whitelist = ['http://localhost:3000'];
const options = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(morgan(morganOption));
app.use(cors(options));
app.use(helmet());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/api/register', registerRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/channels', channelRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/user', userRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
