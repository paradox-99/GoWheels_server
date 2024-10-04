const express = require('express')
const { showAgency, getAgency, agencyInfo, agencyOwnerInfo, updateAgencyOwnerInfo, addVehicleByAgency } = require('../controllers/agencyControllers')
// const { showAgency, getAgency, agencyInfo } = require('../controllers/agencyControllers')
const Router = express.Router();

Router.get('/agency', showAgency);
Router.get('/agency/:agencyId', getAgency);
Router.post('/agencyInfo' , agencyInfo) 
Router.get('/agency/owner/:email', agencyOwnerInfo);
Router.patch('/agency/updateAgencyOwnerInfo/:email', updateAgencyOwnerInfo);
Router.post('/agency/addVehicle', addVehicleByAgency);




module.exports = Router;  