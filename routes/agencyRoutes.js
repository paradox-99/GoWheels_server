const express = require('express')
const { showAgency } = require('../controllers/agencyControllers')
const Router = express.Router();

Router.get('/agency', showAgency)

module.exports = Router;