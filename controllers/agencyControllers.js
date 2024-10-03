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

const getAgency = async(req, res) => {
    try{
        const db = await connectDB();
        const collection = db.collection('agencyData');
        const agencyId = req.params.agencyId;
        const query = { "agency_id":  agencyId}
        const agency = await collection.find(query).toArray();
        res.send(agency);
    }
    catch(error){
        res.status(500).send( 'Error retrieving agency');
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


const agencyOwnerInfo = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("users");

        const email = req.params.email; 
        const ownerData = await collection.findOne(email);
        
        if (!ownerData) {
            return res.status(404).send("Agency owner not found");
        }

        res.send(ownerData);
    } catch (error) {
        console.error("Error retrieving agency owner data:", error);
        res.status(500).send("Error retrieving agency owner data");
    }
};



module.exports = { showAgency , getAgency, agencyInfo, agencyOwnerInfo }