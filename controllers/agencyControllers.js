const connectDB = require("../config/db");

// GET A SINGLE AGENCY OWNER USER INFO
const agencyOwnerInfo = async (req, res) => {
    try {
      const email = req.params.email;
      const db = await connectDB();
      const collection = db.collection("users");
      const ownerData = await collection.findOne({ "email": email });
  
      if (!ownerData) {
        return res.status(404).json({ message: "Owner not found" });
      }
  
      res.status(200).json(ownerData);
    } catch (error) {
      res.status(500).send("Error retrieving agency owner data");
    }
  };
  

const showAgency = async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("");
    const agencyData = await collection.find().toArray();
    res.send(agencyData);
  } catch (error) {
    res.status(500).send("Error retrieving reviews");
  }
};

const getAgency = async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("agencyData");
    const agencyId = req.params.agencyId;
    const query = { agency_id: agencyId };
    const agency = await collection.find(query).toArray();
    res.send(agency);
  } catch (error) {
    res.status(500).send("Error retrieving agency");
  }
};

module.exports = { showAgency, getAgency, agencyOwnerInfo };
