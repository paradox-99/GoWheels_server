const express = require('express')
const { showAgency, getAgency, agencyInfo } = require('../controllers/agencyControllers')
const Router = express.Router();

Router.get('/agency', showAgency);
Router.get('/agency/:agencyId', getAgency);
Router.post('/agencyInfo' , agencyInfo) 

module.exports = Router;  