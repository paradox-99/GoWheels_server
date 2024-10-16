const express = require('express');
const {replaceOTP, verifyOTP } = require('../controllers/otpControllers')
const Router = express.Router();

Router.put('/replaceOTP/:email', replaceOTP);
Router.post('/verifyOTP', verifyOTP);


module.exports = Router;