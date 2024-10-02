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
        const query = { "email": email }
        const user = await collection.find(query).toArray();
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




module.exports = { showUsers, getUser, ownerInfo }