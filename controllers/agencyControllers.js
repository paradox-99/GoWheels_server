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


const agencyInfo = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('agencyData');
        const lastAgency = await collection.findOne({}, { sort: { agency_id: -1 } });
        let newAgencyId = 1;
        if (lastAgency && lastAgency.agency_id) {
            newAgencyId = parseInt(lastAgency.agency_id.replace('AG', '')) + 1;
        }
        const agency_id = `AG${newAgencyId}`;
        const agencyData = { ...req.body, agency_id };
        const result = await collection.insertOne(agencyData);
        res.status(201).json({ message: 'Data inserted successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error inserting data', error });
    }
};

// AGENCY OWNER

const agencyOwnerInfo = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("users");
        const email = req.params.email; 
        const ownerData = await collection.findOne({userEmail: email});
        
        if (!ownerData) {
            return res.status(404).send("Agency owner not found");
        }

        res.send(ownerData);
    } catch (error) {
        console.error("Error retrieving agency owner data:", error);
        res.status(500).send("Error retrieving agency owner data");
    }
};


// UPDATE AGENCY
const updateAgencyOwnerInfo = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const email = req.params.email;
        const updatedData = req.body;
        const query = { userEmail: email };
        const updateDoc = {
            $set: updatedData
        };
        const result = await collection.updateOne(query, updateDoc);
        if (result.modifiedCount === 0) {
            return res.status(404).send('User not found or no changes made');
        }
        res.status(200).send('User updated successfully');
    } catch (error) {
        res.status(500).send('Error updating user: ' + error.message);
    }
};


// delete a agency 
const deleteAgency = async (req, res) => {
    const db = await connectDB();
    const collection = db.collection('agencyData');
    const { id } = req.params;

    // Check if the id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: 'Invalid agency ID' });
    }

    try {
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
            res.status(200).send({ message: 'Agency deleted successfully' });
        } else {
            res.status(404).send({ message: 'Agency not found' });
        }
    } catch (error) {
        console.error('Error deleting agency:', error);
        res.status(500).send({ message: 'Error deleting agency', error });
    }
};


const setStatus = async (req, res) => {
    const db = await connectDB();
    const collection = db.collection('agencyData');
    const { id } = req.params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: 'Invalid agency ID' });
    }

    try {
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: 'blocked' } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).send({ message: 'Agency not found' });
        }

        res.status(200).send({ message: 'Agency blocked successfully' });
    } catch (error) {
        console.error('Error blocking agency:', error);
        res.status(500).send({ message: 'Error blocking agency. Please try again later.' });
    }
};


module.exports = { showAgency, getAgency, agencyInfo, agencyOwnerInfo, updateAgencyOwnerInfo, approveAgency, rejectAgency, deleteAgency, setStatus }
