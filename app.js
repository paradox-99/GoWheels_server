const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io'); 

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const carRoute = require('./routes/carRoutes');
const reviewsAndRatingsRoute = require('./routes/reviewAndRatingRoutes');
// No need to import agency here yet, we will handle it after io initialization
const bookingRoute = require('./routes/userBookingRoutes');
const payment = require('./routes/payment');
const feedbacksRoute = require('./routes/feedbackRoute');
const driverRoute = require('./routes/driverRoute');
const otp = require('./routes/otpRoutes');
const totalInfo = require('./routes/totalRoutes');
const { setupTTLIndex } = require('./controllers/otpControllers');

const app = express();
const server = http.createServer(app);

// Now initialize socket.io after the server is created
const io = socketIO(server, {
    cors: {
        origin: [
            "http://localhost:5176",
            'http://localhost:5172',
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'https://gowheels-99.web.app',
        ],
        credentials: true,  // Allow cookies and credentials
        methods: ["GET", "POST"],  // You can specify which HTTP methods are allowed
    }
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Now import and pass io to the agency routes
const agency = require('./routes/agencyRoutes')(io);

// Configure CORS for Express
app.use(cors({
    origin: [
        "http://localhost:5176",
        'http://localhost:5172',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'https://gowheels-99.web.app',
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up the TTL index
setupTTLIndex();

// Define routes
app.use('/api/authorization', authRoutes);
app.use('/api/usersRoute', userRoutes);
app.use('/api/carsRoute', carRoute);
app.use('/api/reviewsRoute', reviewsAndRatingsRoute);
app.use('/api/agencyRoute', agency); // Now agency route works with io
app.use('/api/bookings', bookingRoute);
app.use('/api/payment', payment);
app.use('/api/feedbackRoute', feedbacksRoute);
app.use('/api/driverRoute', driverRoute);
app.use('/api/otpRoutes', otp);
app.use('/api/totalInfo', totalInfo);

// Export the app and server
module.exports = { app, server, io };