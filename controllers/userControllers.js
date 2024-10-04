const connectDB = require("../config/db")

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
        console.log("user: ",user);
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

const insertUser = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const user = req.body;
        const options = {
            ...user,
            userRole: 'user',
            accountStatus: 'not verified',
        }
        const query = { userEmail: user?.userEmail };
        const existUser = await collection.findOne(query);
        if (existUser) {
            return res.send({ message: "user already exists", insertedId: null });
        }

        const result = await collection.insertOne(options);
        res.send(result);
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

        const options = {
            ...info,
            userRole: 'user',
            accountStatus: 'not verified',
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

module.exports = { showUsers, getUser, insertUser, updateOne, addOne, replaceData, ownerInfo }