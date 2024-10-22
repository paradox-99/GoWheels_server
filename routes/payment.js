const express = require('express');
const { paymentFail, bookingInfo } = require('../controllers/paymentControllers');

const router = express.Router();

module.exports = () => {
    router.post('/order', order);
    router.post('/success/:tranId', paymentSuccess)
    router.post('/fail/:tranId', paymentFail)

    return router;
};