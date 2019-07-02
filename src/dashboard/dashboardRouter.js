'use strict';
const express = require('express');
const DashboardRouter = express.Router();

DashboardRouter.get('/', (req, res) => {
  return res.json({ page: 'dashboard' });
});

module.exports = DashboardRouter;
