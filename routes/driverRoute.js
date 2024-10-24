const express = require('express');
const { driverData, getDrivers } = require('../controllers/driverControllers');
const Router = express.Router();

Router.get('/drivers', getDrivers);
Router.post('/driverInfo', driverData);


module.exports = Router;