const connectDB = require("../config/db")
const { ObjectId } = require('mongodb');
const { generateAndStoreOTP } = require('../config/otpService');
const { sendOTPEmail } = require('../config/nodeMialer');

const showUsers = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');
        const users = await collection.find().toArray();
        res.send(users);
    }
    catch (error) {
        res.status(500).send('Error retrieving users');
    }
}

const getUser = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');
        const email = req.params.email;
        const query = { "userEmail": email }
        const user = await collection.findOne(query);
        res.send(user);
    }
    catch (error) {
        res.status(500).send('Error retrieving user');
    }
}

const ownerInfo = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');
        const ownerData = req.body;
        const result = await collection.insertOne(ownerData);
        res.status(201).json({ message: 'Data inserted successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error inserting data', error });
    }
};

const checkUser = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');
        const { phone, nid } = req.query;
        let phoneExists = false;
        let nidExists = false;

        const phoneCheck = await collection.findOne({ "phone": phone });
        const nidCheck = await collection.findOne({ "nid": nid });

        if (phoneCheck) {
            phoneExists = true
        }

        if (nidCheck) {
            nidExists = true
        }
        res.json({
            phoneExists,
            nidExists
        });
    } catch (error) {
        console.error('Error checking user existence', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const insertUser = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const user = req.body;
        const query = { userEmail: user?.userEmail };

        const currentDate = new Date();
        const creationDate = currentDate.toISOString().slice(0, 10);

        const options = {
            ...user,
            userRole: 'user',
            accountStatus: 'not verified',
            drivingLisence: 'unavailable',
            creationDate: creationDate,
        }

        const existUser = await collection.findOne(query);

        if (existUser) {
            return res.send({ message: "user already exists", insertedId: null });
        }

        const result = await collection.insertOne(options);

        if (result.insertedId) {
            const otp = await generateAndStoreOTP(user?.userEmail);
            await sendOTPEmail(user?.userEmail, otp);
            res.send(result);
        }

    }
    catch (error) {
        res.status(500).send('Error retrieving user');
    }
}

const updateOne = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const email = req.params.email;
        const image = req.body;
        const query = { userEmail: email }
        const updateDoc = {
            $set: { image: image?.image }
        }
        const result = await collection.updateOne(query, updateDoc);
        res.send(result);
    }
    catch (error) {
        res.status(500).send('Error retrieving user');
    }
}

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

const addOne = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const email = req.params.email;
        const image = req.body;
        const query = { userEmail: email };
        const updateDoc = {
            $set: { circleImage: image.userCropImage }
        };
        const result = await collection.updateOne(query, updateDoc);
        res.send(result);
    }
    catch (error) {
        res.status(500).send('Error retrieving user');
    }
}

const replaceData = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const email = req.params.email;
        const info = req.body;
        const query = { userEmail: email };

        const currentDate = new Date();
        const creationDate = currentDate.toISOString().slice(0, 10);

        const options = {
            ...info,
            userRole: 'user',
            accountStatus: 'not verified',
            drivingLisence: 'unavailable',
            creationDate: creationDate,
        }
        const existUser = await collection.findOne(query);
        if (!existUser) {
            return res.send({ message: "This user info is not available", insertedId: null });
        }
        const result = await collection.replaceOne(query, options, { upsert: true });
        res.send(result);
    }
    catch (error) {
        res.status(500).send('Error retrieving user');
    }
}

const updateRole = async (req, res) => {
    const id = req.params.id;  // Get user ID from the URL params
    const { newRole } = req.body;
    const db = await connectDB();
    const collection = db.collection('users');  // Get the new role from the request body

    if (!newRole) {
        return res.status(400).send({ message: 'New role is required' });
    }

    const filter = { _id: new ObjectId(id) };  // Find the user by ID
    const updateDoc = {
        $set: { userRole: newRole }  // Set the new role
    };

    try {
        const result = await collection.updateOne(filter, updateDoc);  // Update the role in the database
        if (result.modifiedCount === 1) {
            res.send({ message: 'Role updated successfully' });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

module.exports = { showUsers, getUser, insertUser, updateOne, addOne, replaceData, ownerInfo, updateRole, checkUser, updateStatus }