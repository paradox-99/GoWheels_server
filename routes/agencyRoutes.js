const express = require('express')
const { showAgency, getAgency } = require('../controllers/agencyControllers')
const Router = express.Router();

Router.get('/agency', showAgency);
Router.get('/agency/:agencyId', getAgency);

module.exports = Router;