const connectDB = require("../config/db");
const { sendOTPEmail } = require("../config/nodeMialer");
const { generateAndStoreOTP } = require("../config/otpService");
// const { ObjectId } = require('mongodb')

const driverData = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('driverData');
        const lastDriver = await collection.findOne({}, { sort: { driver_id: -1 } });
        let newAgencyId = 1;
        if (lastDriver && lastDriver.driver_id) {
            newAgencyId = parseInt(lastDriver.driver_id.replace('AG', '')) + 1;
        }
        const driver_id = `AG${newAgencyId}`;
        const driverData = { ...req.body, driver_id };
        const result = await collection.insertOne(driverData);
        res.status(201).json({ message: 'Data inserted successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error inserting data', error });
    }
};

const getDrivers = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');
        const { district } = req.query; // Get the district from the query parameters

        const query = { userRole: 'driver' }; 
        if (district) {
            query['userAddress.division'] = { $regex: district, $options: 'i' }; // Use district for regex search
        }
        // if (upazilla) {
        //     query['userAddress.upazilla'] = upazilla; // Exact match for upazilla
        // }


        const drivers = await collection.find(query).toArray();
        res.status(200).json(drivers);

    } catch (error) {
        console.error("Error fetching drivers: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



module.exports = { driverData, getDrivers }
