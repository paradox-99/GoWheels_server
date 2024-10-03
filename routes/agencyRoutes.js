const express = require('express')
const { showAgency, getAgency, agencyOwnerInfo } = require('../controllers/agencyControllers')
const Router = express.Router();

Router.get('/agency', showAgency);
Router.get('/agency/:agencyId', getAgency);
Router.get('/agency/owner/:email', agencyOwnerInfo);

module.exports = Router;