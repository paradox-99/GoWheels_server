const connectDB = require("../config/db")

const showAgency = async(req, res) => {
    try{
        const db = await connectDB();
        const collection = db.collection('agencyData');
        const agencyData = await collection.find().toArray();
        res.send(agencyData);
    }
    catch(error) {
        res.status(500).send( 'Error retrieving reviews');
    }
}

module.exports = {showAgency}