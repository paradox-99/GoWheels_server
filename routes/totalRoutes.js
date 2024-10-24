const express = require('express');
const { getTotalRoles, getTotalInfo, getBookingStatusCounts } = require('../controllers/totalControllers');

const Router = express.Router();

Router.get('/totalRoles', getTotalRoles);
Router.get('/totalInfo', getTotalInfo);
Router.get('/totalBookings', getBookingStatusCounts);


module.exports = Router; 