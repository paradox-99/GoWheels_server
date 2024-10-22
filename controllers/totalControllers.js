const connectDB = require("../config/db")

const getTotalRoles = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');
        // Aggregate data based on user roles
        const rolesCount = await collection.aggregate([
            { $group: { _id: "$userRole", count: { $sum: 1 } } }
        ]).toArray();

        res.json(rolesCount);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch role counts' });
    }
};

const getTotalInfo = async (req, res) => {

    try {
        const db = await connectDB();
        const totalUsers = await db.collection('users').countDocuments();
        const totalAgencies = await db.collection('agencyData').countDocuments();
        const totalCars = await db.collection('vehiclesData').countDocuments();
        const totalRevenue = await db.collection('bookings').aggregate([
            {
                $match: { price: { $exists: true } } // Ensure the price field exists
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: { $toDouble: "$price" } } // Convert to double if needed
                }
            }
        ]).toArray();
        console.log( 'taka',totalRevenue)
        
        const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

        // Construct the response
        const response = {
            totalUsers,
            totalAgencies,
            totalCars,
            totalRevenue: revenue
        };

        res.json(response);
    } 
    catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    };
}



const getBookingStatusCounts = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('bookings');
        const bookingCounts = await collection.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 } 
                }
            }
        ]).toArray();

        res.json(bookingCounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};






module.exports = { getTotalRoles, getTotalInfo, getBookingStatusCounts }
