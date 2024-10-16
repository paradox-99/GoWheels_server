const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes');
const carRoute = require('./routes/carRoutes');
const reviewsAndRatingsRoute = require('./routes/reviewAndRatingRoutes');
const agency = require('./routes/agencyRoutes');
const bookingRoute = require('./routes/userBookingRoutes')

const app = express();

app.use(cors({
    origin: [
        '*',
        'http://localhost:5173',
        'http://localhost:5174',
        "http://localhost:5175",
        "http://localhost:5176",

    ],
    credentials: true
}
));
app.use(express.json());

app.use('/api/authorization', authRoutes);
app.use('/api/usersRoute', userRoutes);
app.use('/api/carsRoute', carRoute);
app.use('/api/reviewsRoute', reviewsAndRatingsRoute);
app.use('/api/agencyRoute', agency); // Ensure this is correct
app.use('/api/bookings', bookingRoute)

module.exports = app;
