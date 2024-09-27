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

const getUser = async(req, res) => {
    try{
        const db = await connectDB();
        const collection = db.collection('users');
        const email = req.params.email;
        const query = { "email":  email}
        const user = await collection.find(query).toArray();
        res.send(user);
    }
    catch(error){
        res.status(500).send( 'Error retrieving user');
    }
}

module.exports = { showUsers, getUser }