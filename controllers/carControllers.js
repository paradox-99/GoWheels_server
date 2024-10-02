const connectDB = require("../config/db")

// api to get all vehicles data
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

// api to get agency wise vehicle data
const getVehiclesAgency = async(req, res) => {
    try{
        const db = await connectDB();
        const collection = db.collection('vehiclesData');
        const id = req.params.agencyId;
        const query = { "agencyId":  id}
        const vehicles = await collection.find(query).toArray();
        res.send(vehicles);
    }
    catch(error){
        res.status(500).send( 'Error retrieving vehicles');
    }
}

const getVehicle = async(req, res) => {
    try{
        const db = await connectDB();
        const collection = db.collection('vehiclesData');
        const id = req.params.id;
        const query = { _id: new Object(id)}
        const vehicle = await collection.find(query).toArray();
        res.send(vehicle);
    }
    catch(error){
        res.status(500).send( 'Error retrieving vehicle');
    }
}


const vehiclesInfo = async (req, res) => {
    try {
      const db = await connectDB();
      const collection = db.collection('vehiclesData');
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

module.exports = { showCars, getVehiclesAgency, getVehicle, vehiclesInfo }