const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes');
const carRoute = require('./routes/carRoutes');
const reviewsAndRatingsRoute = require('./routes/reviewAndRatingRoutes');
const agency = require('./routes/agencyRoutes'); 


const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/authorization', authRoutes);
app.use('/api/usersRoute', userRoutes);
app.use('/api/carsRoute', carRoute);
app.use('/api/reviewsRoute', reviewsAndRatingsRoute);
app.use('/api/agencyRoute', agency);


module.exports = app;