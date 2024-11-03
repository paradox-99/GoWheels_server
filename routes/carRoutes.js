const express = require('express');
const { showCars, getVehiclesAgency, getVehicle, getCarsByBrand, vehiclesInfo, getFreeCarsForSearchResult, getCarsByLocation } = require('../controllers/carControllers');
const Router = express.Router();

Router.get('/cars', showCars);
Router.get('/agency/:id', getVehiclesAgency);
Router.get('/vehicle/:id', getVehicle);
Router.post('/vehilesInfo', vehiclesInfo)
// Router.post('/addVehicle', addVehicle);
Router.get('/brand/:brand', getCarsByBrand);
Router.get('/getSearchData', getFreeCarsForSearchResult);
Router.get('/getCarByLocation', getCarsByLocation);

module.exports = Router;