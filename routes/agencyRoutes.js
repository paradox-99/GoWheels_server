const express = require('express')
const { showAgency, getAgency, approveAgency, rejectAgency } = require('../controllers/agencyControllers')
const Router = express.Router();

Router.get('/agency', showAgency);
Router.get('/agency/:agencyId', getAgency);
Router.patch('/agency/:agencyId', approveAgency);
Router.put('/agency/:agencyId', rejectAgency);

module.exports = Router;