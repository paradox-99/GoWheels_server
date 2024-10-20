const express = require('express');
const { paymentFail, bookingInfo } = require('../controllers/paymentControllers');

const router = express.Router();

module.exports = (io) => {
    router.post('/fail/:tranId', paymentFail);
    router.get('/booking', (req, res) => bookingInfo(req, res, io)); 

    return router;  
};