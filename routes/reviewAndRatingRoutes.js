const express = require('express')
const { showReviewsAndRatings } = require('../controllers/reviewControllers')
const Router = express.Router();

Router.get('/reviews', showReviewsAndRatings)

module.exports = Router;