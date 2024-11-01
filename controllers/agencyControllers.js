const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");
const io = require('../app');


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
    console.log(agencyId);

    const query = { agency_id: agencyId };
    const agency = await collection.findOne(query);

    res.send(agency);
  } catch (error) {
    res.status(500).send("Error retrieving agency");
  }
};

const agencyData = async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("agencyData");

    const email = req.params.email;
    const query = { userEmail: email }

    const result = await collection.findOne(query)
    res.send(result);
  }
  catch (error) {
    console.log(error)
  }
}

const approveAgency = async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("agencyData");
    const agencyId = req.params.agencyId;
    const filter = { _id: new ObjectId(agencyId) };
    const updateDoc = {
      $set: {
        status: "verified",
        userRole: "agency",
      },
    };
    const result = await collection.updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    res.status(500).send("Error retrieving agency");
  }
};

const rejectAgency = async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("agencyData");
    const agencyId = req.params.agencyId;
    const filter = { _id: new ObjectId(agencyId) };
    const updateDoc = {
      $set: {
        status: "Rejected",
        userRole: "user",
      },
    };
    const result = await collection.updateOne(filter, updateDoc);
    res.send(result);
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

    if (!ownerData) {
      return res.status(404).send("Agency owner not found");
    }
    return res.status(200).send(ownerData);
  } catch (error) {
    return res.status(500).send("Server error while retrieving agency owner info");
  }
};

// UPDATE AGENCY
const updateAgencyOwnerInfo = async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("users");
    const email = req.params.email;

    // Extract fields from request body
    const {
      firstName,
      lastName,
      phone,
      gender,
      image,
      division,
      district,
      upazilla,
      nid,
      dateOfBirth,
    } = req.body;

    // Build the update document with dot notation for nested fields
    const updateDoc = {
      $set: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
        ...(nid && { nid }),
        ...(dateOfBirth && { dateOfBirth }),
        ...(gender && { gender }), // Ensure these are included
        ...(image && { image }), // Ensure these are included
        ...(division && { "userAddress.division": division }),
        ...(district && { "userAddress.district": district }),
        ...(upazilla && { "userAddress.upazilla": upazilla }),
      },
    };

    const query = { userEmail: email };

    // Perform the update
    const result = await collection.updateOne(query, updateDoc);

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

const addVehicleByAgency = async (req, res, io) => {
  try {
    const db = await connectDB();
    const collection = db.collection("vehiclesData");
    const vehicleData = req.body;

    const result = await collection.insertOne(vehicleData);
    const newVehicle = await collection.findOne({ _id: result.insertedId });

    io.emit('newVehicleAdded', {
      message: 'A new vehicle has been added!',
      vehicle: newVehicle
    });
    res.status(201).send(newVehicle);
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
    const userEmail = req.params.userEmail;
    const query = { "agencyInfo.userEmail": userEmail };

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

// GET THE BOOKING HISTORY FOR THAT AGENCY USER
const getBookingHistory = async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("bookings");
    const email = req.params.email;
    const query = { agency_id: agency_id };

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

// GET A SINGLE VEHICLE INFO BY THAT VEHICLE ID
const getOneVehicleDetails = async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("vehiclesData");
    const id = req.params.id;

    // Corrected syntax for finding the vehicle by ID
    const oneVehicleInfo = await collection.findOne({ _id: new ObjectId(id) }); // Use findOne for a single document

    if (!oneVehicleInfo) {
      return res.status(404).send("Vehicle info not found");
    }

    res.send(oneVehicleInfo);
  } catch (error) {
    console.error("Error getting vehicle data:", error);
    res.status(500).send("Error getting vehicle data. Please try again later.");
  }
};

// UPDATE A SINGLE VEHICLE INFO
const updateOneVehicleInfo = async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("vehiclesData");
    const id = req.params.id;

    // Extract fields from request body
    const {
      licenseNumber,
      // image: uploadedImage,
      seat,
      mileage,
      gear,
      fuel,
      rentalPrice,
      transmission,
      brand,
      model,
      buildYear,
      expireDate,
      fitnessCertificate,
      issuingAuthority,
      insuranceNumber,
      insurancePeriod,
      insuranceDetails,

      additionalInfo: {
        airConditioning,
        gps,
        bluetooth,
      },
      agencyInfo: {
        email: userEmail,
        agencyId: agency_id,
      }
    } = req.body;

    // Build the update document with dot notation for nested fields
    const updateDoc = {
      $set: {
        ...(licenseNumber && { licenseNumber }),
        // ...(uploadedImage && { image: uploadedImage }),
        ...(seat && { seat }),
        ...(mileage && { mileage }),
        ...(gear && { gear }),
        ...(fuel && { fuel }),
        ...(rentalPrice && { rentalPrice }),
        ...(transmission && { transmission }),
        ...(brand && { brand }),
        ...(model && { model }),
        ...(buildYear && { buildYear }),
        ...(expireDate && { expireDate }),
        ...(fitnessCertificate && { fitnessCertificate }),
        ...(issuingAuthority && { issuingAuthority }),
        ...(insuranceNumber && { insuranceNumber }),
        ...(insurancePeriod && { insurancePeriod }),
        ...(insuranceDetails && { insuranceDetails }),
        ...(airConditioning && {
          "additionalInfo.airConditioning": airConditioning,
        }),
        ...(gps && { "additionalInfo.gps": gps }),
        ...(bluetooth && { "additionalInfo.bluetooth": bluetooth }),
        ...(userEmail && { "agencyInfo.email": userEmail }),
        ...(agency_id && { "agencyInfo.agencyId": agency_id }),
      },
    };

    const query = { _id: new ObjectId(id) };

    // Perform the update
    const result = await collection.updateOne(query, updateDoc);

    if (result.modifiedCount === 0) {
      return res.status(404).send("Vehicle not found or no changes made");
    }

    res.status(200).send("Vehicle updated successfully");
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).send("Error updating vehicle: " + error.message);
  }
};

// GET Booking History for a specific agency
const getAgencyDataForAgency = async (req, res) => {
  const email = req.params.email;

  try {
    const db = await connectDB();
    const collection = db.collection("agencyData");

    // Fetch bookings based on agencyId
    const agencyData = await collection.findOne({ agencyEmail: email });
    res.send(agencyData);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// delete a agency
const deleteAgency = async (req, res) => {
  const db = await connectDB();
  const collection = db.collection("agencyData");
  const { id } = req.params;

  // Check if the id is a valid ObjectId
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid agency ID" });
  }

  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.status(200).send({ message: "Agency deleted successfully" });
    } else {
      res.status(404).send({ message: "Agency not found" });
    }
  } catch (error) {
    console.error("Error deleting agency:", error);
    res.status(500).send({ message: "Error deleting agency", error });
  }
};

const setStatus = async (req, res) => {
  const db = await connectDB();
  const collection = db.collection("agencyData");
  const { id } = req.params;

  // Validate ObjectId
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid agency ID" });
  }

  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "blocked" } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Agency not found" });
    }

    res.status(200).send({ message: "Agency blocked successfully" });
  } catch (error) {
    console.error("Error blocking agency:", error);
    res
      .status(500)
      .send({ message: "Error blocking agency. Please try again later." });
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
  approveAgency,
  rejectAgency,
  deleteAgency,
  setStatus,
  getOneVehicleDetails,
  updateOneVehicleInfo,
  getAgencyDataForAgency,
  agencyData,
};
