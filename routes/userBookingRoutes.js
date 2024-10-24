const express = require('express');
const router = express.Router();
const { getUserBookedCars, getUserBookings, getFavoriteCars, bookingData, getPendingVehicles,  } = require('../controllers/userBookingsController');


// get booked cars -m
router.get('/user/:userId/booked-cars', getUserBookedCars);
// get UserBookings - m
router.get('/user/:userId', getUserBookings);
// get User favorites car- m
router.post('/favorites', getFavoriteCars);



router.get("/bookings/:agencyId", bookingData);

// router.get("/bookings/activeVehicles/:agencyId", getPendingVehicles);

router.get("/bookings/activeVehicles/:email", getPendingVehicles);



module.exports = router;