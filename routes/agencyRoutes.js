const express = require("express");

const {
  showAgency,
  getAgency,
//   agencyInfo,
  agencyOwnerInfo,
  updateAgencyOwnerInfo,
  addVehicleByAgency,
  getVehicleInfo,
  approveAgency, rejectAgency, deleteAgency, setStatus
} = require("../controllers/agencyControllers");


const Router = express.Router();
Router.get("/agency", showAgency);
Router.get("/agency/owner/:email", agencyOwnerInfo);
Router.get("/user/:email", agencyOwnerInfo);
Router.get('/agency/:agencyId', getAgency);
Router.patch('/agency/:agencyId', approveAgency);
Router.put('/agency/:agencyId', rejectAgency);
// Router.post('/agencyInfo' , agencyInfo) 
Router.delete('/agencies/:id' , deleteAgency) 
Router.patch('/agencyBlock/:id' , setStatus) 
Router.get('/agency/owner/:email', agencyOwnerInfo);
Router.put('/agency/owner/updateAgencyOwnerInfo/:email', updateAgencyOwnerInfo);
Router.patch("/updateUserInfo/:email", updateAgencyOwnerInfo);
Router.post("/agency/addVehicle", addVehicleByAgency);
Router.get("/agency/vehicleInfo/:email", getVehicleInfo);

module.exports = Router;
