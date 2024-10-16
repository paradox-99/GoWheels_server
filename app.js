const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes');
const carRoute = require('./routes/carRoutes');
const reviewsAndRatingsRoute = require('./routes/reviewAndRatingRoutes');
const agency = require('./routes/agencyRoutes');
const bookingRoute = require('./routes/userBookingRoutes')
const payment = require('./routes/payment')
const feedbacksRoute = require('./routes/feedbackRoute')
const driverRoute = require('./routes/driverRoute')
const otp = require('./routes/otpRoutes');


const app = express(); 
 
app.use(cors({
    origin: [
        'http://localhost:5172',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'https://gowheels-99.web.app',
    ],
    credentials: true
}
));

app.use(express.json());

app.use('/api/authorization', authRoutes);
app.use('/api/usersRoute', userRoutes);
app.use('/api/carsRoute', carRoute);
app.use('/api/reviewsRoute', reviewsAndRatingsRoute);
app.use('/api/agencyRoute', agency);
app.use('/api/bookings', bookingRoute)
app.use('/api/payment', payment)
app.use('/api/feedbackRoute', feedbacksRoute)
app.use('/api/driverRoute', driverRoute)
app.use('/api/otpRoutes', otp)

module.exports = app;
