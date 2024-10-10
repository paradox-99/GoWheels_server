const express = require('express')
const { showAgency, getAgency, agencyInfo, agencyOwnerInfo, updateAgencyOwnerInfo, approveAgency, rejectAgency } = require('../controllers/agencyControllers')

const Router = express.Router();

Router.get('/agency', showAgency);
Router.get('/agency/:agencyId', getAgency);
Router.patch('/agency/:agencyId', approveAgency);
Router.put('/agency/:agencyId', rejectAgency);
Router.post('/agencyInfo' , agencyInfo) 
Router.get('/agency/owner/:email', agencyOwnerInfo);
Router.put('/agency/owner/updateAgencyOwnerInfo/:email', updateAgencyOwnerInfo);


module.exports = Router;  