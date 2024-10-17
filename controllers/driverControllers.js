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



const updateStatus = async (req, res) => {

    const email = req.params.email;
    const { accountStatus } = req.body;

    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const result = await collection.updateOne(
            { userEmail: email },
            { $set: { accountStatus } }
        );

        if (result.modifiedCount > 0) {
            return res.send(result);
        } else {
            return res.status(404).send({ message: "User not found or no changes made." });
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send("Server error while updating account status.");
    }
}



const insertUser = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const user = req.body;
        const options = {
            ...user,
            userRole: 'user',
            accountStatus: 'not verified',
            drivingLicense: 'unavailable'
        }
        const query = { userEmail: user?.userEmail };
        const existUser = await collection.findOne(query);
        if (existUser) {
            return res.send({ message: "user already exists", insertedId: null });
        }

        const result = await collection.insertOne(options);
        if (result.insertedId) {
            const otp = await generateAndStoreOTP(user?.userEmail);
            await sendOTPEmail(user?.userEmail, otp)
            return res.send(result);
        }
    }
    catch (error) {
        return res.status(500).send('Error retrieving user');
    }
}

module.exports = { driverData }
