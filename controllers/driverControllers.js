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



module.exports = { driverData }
