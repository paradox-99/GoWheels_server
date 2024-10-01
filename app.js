const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes');
const carRoute = require('./routes/carRoutes');
const reviewsAndRatingsRoute = require('./routes/reviewAndRatingRoutes');
const agency = require('./routes/agencyRoutes');

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
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

module.exports = app;
