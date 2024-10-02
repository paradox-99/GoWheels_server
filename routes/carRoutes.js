const express = require('express');
const { showCars, getVehiclesAgency, getVehicle, vehiclesInfo } = require('../controllers/carControllers');
const Router = express.Router();


Router.get('/cars', showCars);
Router.get('/agency/:id', getVehiclesAgency);
Router.get('/vehicle/:id', getVehicle);
Router.post('/vehilesInfo', vehiclesInfo)

module.exports = Router;