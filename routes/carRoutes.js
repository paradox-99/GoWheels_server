const express = require('express');
const { showCars } = require('../controllers/carControllers');
const Router = express.Router();


Router.get('/cars', showCars)

module.exports = Router;