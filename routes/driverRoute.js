const express = require('express');
const { driverData } = require('../controllers/driverControllers');
const Router = express.Router();

Router.post('/driverInfo', driverData);


module.exports = Router;