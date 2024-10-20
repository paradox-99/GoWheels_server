const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');


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
const { setupTTLIndex } = require('./controllers/otpControllers');

const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
        origin: [
            '*', 
            "http://localhost:5176",
            'http://localhost:5172',
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'https://gowheels-99.web.app',
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.use(cors({
    origin: [
        '*',
        "http://localhost:5176",
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
app.use(express.urlencoded({ extended: true }));
setupTTLIndex();

app.use('/api/authorization', authRoutes);
app.use('/api/usersRoute', userRoutes);
app.use('/api/carsRoute', carRoute);
app.use('/api/reviewsRoute', reviewsAndRatingsRoute);
app.use('/api/agencyRoute', agency);
app.use('/api/bookings', bookingRoute)
app.use('/api/payment', payment(io))
app.use('/api/feedbackRoute', feedbacksRoute)
app.use('/api/driverRoute', driverRoute)
app.use('/api/otpRoutes', otp)

module.exports = { app, server, io };
