const express = require('express')
const { getCarReviews, createCarReview } = require('../controllers/carFeedbackController')
const Router = express.Router();

Router.get('/feedbacks/:carId', getCarReviews )
Router.get('/feedbacks', createCarReview )

module.exports = Router;