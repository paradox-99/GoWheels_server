const connectDB = require("../config/db");
const { ObjectId } = require('mongodb');


const getUserBookings = async (req, res) => {
    try {
        const db = await connectDB();
        const bookingsCollection = db.collection('bookings');
        const userId = req.params.userId;
        const history = req.query.history === 'true';
        let query = {
            userId: userId,
            status: { $in: ['Pending', 'Confirmed'] }
        }
        if (history){
            query.status = { $in: ['Completed', 'Cancelled'] }
        }
        const userBookings = await bookingsCollection.find(query).toArray(); 
        if (!userBookings.length) {
            console.log("TEST");
            return res.send({ message: 'Ohoo! You do not have any bookings 😌' });
        }

        res.status(200).json({ userBookings });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user bookings' });
    }
};

//  all cars booked by a user -m
const getUserBookedCars = async (req, res) => {
    try {
        const db = await connectDB();
        const bookingsCollection = db.collection('bookings');
        const carsCollection = db.collection('vehiclesData');
        const userId = req.params.userId;

        //  bookings for the given userId -m
        const userBookings = await bookingsCollection.find({ userId: userId }).toArray();
        
        if (!userBookings.length) {
            console.log("TEST");
            return res.send({ message: 'No bookings found for this user.' });
        }

        const carIds = userBookings.map(booking => new ObjectId(booking.carId));
        // console.log(carIds); -m
        //  car details -m
        const bookedCars = await carsCollection.find({ _id: { $in: carIds } }).toArray();

        res.status(200).json({ bookedCars });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booked cars' });
    }
};

const getFavoriteCars = async (req, res) => {
    try {
        const db = await connectDB();
        const carsCollection = db.collection('vehiclesData');
        const { ids } = req.body; 
        console.log(req.body);
        console.log("test favorite");
        if (!ids || !ids.length) {
            return res.status(400).json({ message: 'No favorite cars provided.' });
        }

        const carObjectIds = ids.map(carId => new ObjectId(carId));
        const favoriteCars = await carsCollection.find({ _id: { $in: carObjectIds } }).toArray();

        if (!favoriteCars.length) {
            return res.status(404).json({ message: 'No favorite cars found.' });
        }

        res.status(200).json(favoriteCars);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching favorite cars' });
    }
};

module.exports = { getUserBookedCars, getUserBookings, getFavoriteCars };
