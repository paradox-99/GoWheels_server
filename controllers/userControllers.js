const connectDB = require("../config/db")

const showUsers = async(req, res) => {
    try{
        const db = await connectDB();
        const collection = db.collection('users');
        const users = await collection.find().toArray();
        res.json(users);
    }
    catch(error) {
        res.status(500).json({ message: 'Error retrieving users' });
    }
}

module.exports = {showUsers}