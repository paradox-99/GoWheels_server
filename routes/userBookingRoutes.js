const express = require('express');
const router = express.Router();
const { getUserBookedCars } = require('../controllers/userBookingsController'); 
const { getUserBookings } = require('../controllers/userBookingsController'); 

//  fetch cars booked by user -m
router.get('/user/:userId/booked-cars', getUserBookedCars);
// getUserBookings - m
router.get('/user/:userId', getUserBookings);

module.exports = router;
