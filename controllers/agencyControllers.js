const connectDB = require("../config/db")
const { ObjectId } = require('mongodb')

const showAgency = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('agencyData');
        const agencyData = await collection.find().toArray();
        res.send(agencyData);
    }
    catch (error) {
        res.status(500).send('Error retrieving reviews');
    }
}

const getAgency = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('agencyData');
        const agencyId = req.params.agencyId;
        const query = { "agency_id": agencyId }
        const agency = await collection.find(query).toArray();
        res.send(agency);
    }
    catch (error) {
        res.status(500).send('Error retrieving agency');
    }
}

const approveAgency = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("agencyData");
        const agencyId = req.params.agencyId
        const filter = { _id: new ObjectId(agencyId) }
        const updateDoc = {
            $set: {
                status: "verified",
                userRole: "agency",
            }
        }
        const result = await collection.updateOne(filter, updateDoc)
        res.send(result)
    }
    catch (error) {
        res.status(500).send('Error retrieving agency');
    }
}
const rejectAgency = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("agencyData");
        const agencyId = req.params.agencyId
        const filter = { _id: new ObjectId(agencyId) }
        const updateDoc = {
            $set: {
                status: "Rejected",
                userRole: "user",
            }
        }
        const result = await collection.updateOne(filter, updateDoc)
        res.send(result)
    }
    catch (error) {
        res.status(500).send('Error retrieving agency');
    }
}



module.exports = { showAgency, getAgency, approveAgency, rejectAgency }