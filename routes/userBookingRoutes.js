const express = require('express');
const router = express.Router();
const { getUserBookedCars, getUserBookings, getFavoriteCars, getFreeCarsForSearchResult } = require('../controllers/userBookingsController');

// get booked cars -m
router.get('/user/:userId/booked-cars', getUserBookedCars);
// get UserBookings - m
router.get('/user/:userId', getUserBookings);
// get User favorites car- m
router.post('/favorites', getFavoriteCars);

router.get('/getSearchData', getFreeCarsForSearchResult)


module.exports = router;