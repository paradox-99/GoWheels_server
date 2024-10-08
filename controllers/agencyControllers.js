const connectDB = require("../config/db");

const showAgency = async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("agencyData");
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

const agencyInfo = async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("agencyData");
    const lastAgency = await collection.findOne(
      {},
      { sort: { agency_id: -1 } }
    );
    let newAgencyId = 1;
    if (lastAgency && lastAgency.agency_id) {
      newAgencyId = parseInt(lastAgency.agency_id.replace("AG", "")) + 1;
    }
    const agency_id = `AG${newAgencyId}`;
    const agencyData = { ...req.body, agency_id };
    const result = await collection.insertOne(agencyData);
    res.status(201).json({ message: "Data inserted successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Error inserting data", error });
  }
};

// AGENCY OWNER
const agencyOwnerInfo = async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("users");
    const email = req.params.email;
    const query = { userEmail: email };
    const ownerData = await collection.findOne(query);
    // console.log(ownerData);
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
    const collection = db.collection("users");
    const email = req.params.email;
    const updatedData = req.body;
    const query = { userEmail: email };
    const updateDoc = {
      $set: updatedData,
    };
    const result = await collection.updateOne(query, updateDoc);
    console.log(updateDoc);
    if (result.modifiedCount === 0) {
      return res.status(404).send("User not found or no changes made");
    }
    res.status(200).send("User updated successfully");
  } catch (error) {
    res.status(500).send("Error updating user: " + error.message);
  }
};

// ADD VEHICLE FROM AGENCY OWNER DASHBOARD
// const addVehicleByAgency = async (req, res) => {
//     try {
//       const db = await connectDB();
//       const collection = db.collection("vehiclesData");

//       // Extract vehicle data from the request body
//       const {
//         licenseNumber,
//         avatar,
//         seat,
//         mileage,
//         gear,
//         fuel,
//         rentalPrice,
//         transmission,
//         brand,
//         model,
//         buildYear,
//         expireDate,
//         fitnessCertificate,
//         issuingAuthority,
//         insuranceNumber,
//         insurancePeriod,
//         insuranceDetails,
//       } = req.body;

//       // Create the new vehicle object
//       const newVehicle = {
//         licenseNumber,
//         avatar,
//         seat,
//         mileage,
//         gear,
//         fuel,
//         rentalPrice,
//         transmission,
//         brand,
//         model,
//         buildYear,
//         expireDate,
//         fitnessCertificate,
//         issuingAuthority,
//         insuranceNumber,
//         insurancePeriod,
//         insuranceDetails,
//         addedAt: new Date(), // Timestamp of when the vehicle is added
//       };

//       // Insert the new vehicle into the collection
//       const result = await collection.insertOne(newVehicle);

//       // Send a success response
//       res.status(201).json({
//         message: "Vehicle added successfully",
//         vehicleId: result.insertedId,
//         data: newVehicle,
//       });

//     } catch (error) {
//       console.error("Error adding vehicle:", error);
//       res.status(500).json({
//         message: "Failed to add vehicle",
//         error: error.message,
//       });
//     }
//   };

const addVehicleByAgency = async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("vehiclesData");
    const vehicleData = req.body;

    // console.log(vehicleData);
    const result = await collection.insertOne(vehicleData);
    res.status(201).send(result); // Respond with the result
  } catch (error) {
    console.error("Error adding vehicle:", error);
    res.status(500).send("Error adding vehicle. Please try again later.");
  }
};

// GET THE VEHICLE INFO FOR THAT AGENCY USER
const getVehicleInfo = async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("vehiclesData");
    const email = req.params.email;
    const query = { "agencyInfo.email": email };

    const vehicleInfo = await collection.find(query).toArray();
    if (!vehicleInfo) {
      return res.status(404).send("Vehicle info not found");
    }
    res.send(vehicleInfo);
  } catch (error) {
    console.error("Error getting vehicle data:", error);
    res.status(500).send("Error getting vehicle data. Please try again later.");
  }
};

module.exports = {
  showAgency,
  getAgency,
  agencyInfo,
  agencyOwnerInfo,
  updateAgencyOwnerInfo,
  addVehicleByAgency,
  getVehicleInfo,
};
