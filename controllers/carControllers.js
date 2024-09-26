const connectDB = require("../config/db")

const showCars = async(req, res) => {
    try{
        const db = await connectDB();
        const collection = db.collection('vehiclesData');
        const cars = await collection.find().toArray();
        res.send(cars);
    }
    catch(error) {
        res.status(500).send('Error retrieving cars');
    }
}

module.exports = {showCars}