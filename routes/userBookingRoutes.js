const express = require('express');
const router = express.Router();
const { getUserBookedCars, getUserBookings, getFreeCarsForSearchResult } = require('../controllers/userBookingsController'); 

//  fetch cars booked by user -m
router.get('/user/:userId/booked-cars', getUserBookedCars);
// getUserBookings - m
router.get('/user/:userId', getUserBookings);
router.get('/getSearchData', getFreeCarsForSearchResult)

module.exports = router;