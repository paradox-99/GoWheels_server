const express = require("express");
const {
  showAgency,
  getAgency,
  agencyInfo,
  agencyOwnerInfo,
  updateAgencyOwnerInfo,
  addVehicleByAgency,
  getVehicleInfo,
} = require("../controllers/agencyControllers");
// const { showAgency, getAgency, agencyInfo } = require('../controllers/agencyControllers')
const Router = express.Router();

Router.get("/agency", showAgency);
Router.get("/agency/:agencyId", getAgency);
Router.post("/agencyInfo", agencyInfo);
// Router.get("/agency/owner/:email", agencyOwnerInfo);
Router.get("/user/:email", agencyOwnerInfo);

Router.patch("/updateUserInfo/:email", updateAgencyOwnerInfo);
Router.post("/agency/addVehicle", addVehicleByAgency);
Router.get("/agency/vehicleInfo/:email", getVehicleInfo);

module.exports = Router;
