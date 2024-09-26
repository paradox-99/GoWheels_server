const connectDB = require("../config/db")

const showUsers = async(req, res) => {
    try{
        const db = await connectDB();
        const collection = db.collection('users');
        const users = await collection.find().toArray();
        res.send(users);
    }
    catch(error) {
        res.status(500).send( 'Error retrieving users');
    }
}

module.exports = {showUsers}