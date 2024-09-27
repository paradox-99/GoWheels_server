const express = require('express');
const { showCars, getVehiclesAgency, getVehicle, addVehicle } = require('../controllers/carControllers');
const Router = express.Router();


Router.get('/cars', showCars);
Router.get('/agency/:id', getVehiclesAgency);
Router.get('/vehicle/:id', getVehicle);
Router.post('/addVehicle', addVehicle)

module.exports = Router;