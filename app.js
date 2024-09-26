const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const carRoute = require('./routes/carRoutes');
// const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use('/api/usersRoute', userRoutes);
app.use('/api/carsRoute', carRoute)


module.exports = app;
