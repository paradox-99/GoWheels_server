const connectDB = require("../config/db");
const { ObjectId } = require('mongodb');


// fetch bookings collection by user -m
const getUserBookings = async (req, res) => {
    try {
        const db = await connectDB();
        const bookingsCollection = db.collection('bookings');
        console.log("booking collection");

        const userId = req.params.userId;
        console.log(userId);

        // Fetch bookings -m
        const userBookings = await bookingsCollection.find({ userId: userId }).toArray();

        if (!userBookings.length) {
            return res.status(404).json({ message: 'No bookings found for this user.' });
        }

        res.status(200).json({ userBookings });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user bookings' });
    }

};
// fetch all cars booked by a user -m
const getUserBookedCars = async (req, res) => {
    try {
        const db = await connectDB();
        const bookingsCollection = db.collection('bookings');
        const carsCollection = db.collection('vehiclesData');
        console.log("booking car collection");
        const userId = req.params.userId;
        console.log(userId);

        // Fetch bookings for the given userId -m
        const userBookings = await bookingsCollection.find({ userId: userId }).toArray();
        // console.log(userBookings); -m
        if (!userBookings.length) {
            return res.status(404).json({ message: 'No bookings found for this user.' });
        }

        const carIds = userBookings.map(booking => new ObjectId(booking.carId));
        // console.log(carIds); -m
        // Fetch car details -m
        const bookedCars = await carsCollection.find({ _id: { $in: carIds } }).toArray();

        res.status(200).json({ bookedCars });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booked cars' });
    }
};

const getFreeCarsForSearchResult = async(req, res) => {
    try {
        const db = await connectDB();
        const bookingsCollection = db.collection('bookings');
        const carsCollection = db.collection('vehiclesData');
        const agency = db.collection('agencyData');
        const data = req.query;

        // adding date and time together and converting them into date object
        const date_time = `${data.fromDate}T${data.fromTime}`;
        const new_date = new Date(date_time)

        const result1 = await carsCollection.find({bookingStatus: false}).toArray();
        console.log(result1);
        
        const query = { $and: [{"agencyAddress.division": data.division}, {"agencyAddress.district": data.district}, {"agencyAddress.upazilla": data.upazilla}] }
        // console.log(query);
        
        const result2 = await agency.find(query).toArray()
        console.log(result2);

        res.send('Data fetched')
    }
    catch(error){
        res.status(500).json({ message: 'Error fetching booked cars' });
    }
}

module.exports = { getUserBookedCars, getUserBookings, getFreeCarsForSearchResult };
