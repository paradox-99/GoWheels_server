const express = require("express");
const {
  showAgency,
  getAgency,
  agencyInfo,
  agencyOwnerInfo,
  updateAgencyOwnerInfo,
  addVehicleByAgency,
  getVehicleInfo,
  approveAgency,
  rejectAgency,
  deleteAgency,
  setStatus,
  getOneVehicleDetails,
  updateOneVehicleInfo,
  getAgencyDataForAgency,
  agencyData
} = require("../controllers/agencyControllers");

// Modify Router to accept io parameter
const router = (io) => {
  const Router = express.Router();

 // Define routes
  Router.get("/agency", showAgency);
  Router.get("/agency/owner/:email", agencyOwnerInfo);
  Router.get("/user/:email", agencyOwnerInfo);
  Router.get('/agency/:agencyId', getAgency);

  Router.get('/agencyInformation/:email', agencyData);



  Router.patch('/agency/:agencyId', approveAgency);
  Router.put('/agency/:agencyId', rejectAgency);
  Router.post('/agencyInfo', agencyInfo);

  Router.delete('/agencies/:id', deleteAgency);
  Router.patch('/agencyBlock/:id', setStatus);
  Router.put('/agency/owner/updateAgencyOwnerInfo/:email', updateAgencyOwnerInfo);
  Router.patch("/updateUserInfo/:email", updateAgencyOwnerInfo);

  // Pass io to the addVehicleByAgency controller
  Router.post("/agency/addVehicle", (req, res) => addVehicleByAgency(req, res, io));

  Router.get("/agency/vehicleInfo/:email", getVehicleInfo);
  Router.get("/agency/vehicle-details/:id", getOneVehicleDetails);
  Router.patch("/agency/updateOneVehicleInfo/:id", updateOneVehicleInfo);
  Router.get("/agencyData/:email", getAgencyDataForAgency);

  return Router;
};

module.exports = router;
