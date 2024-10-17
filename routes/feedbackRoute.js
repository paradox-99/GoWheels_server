const express = require('express')
const { getCarReviews, createCarReview } = require('../controllers/carFeedbackController')
const Router = express.Router();

Router.get('/feedbacks/:carId', getCarReviews )
Router.post('/feedback', createCarReview)
// Router.put('/feedback/:reviewId', updateCarReview);


module.exports = Router;