const connectDB = require("../config/db")
const { ObjectId } = require('mongodb')


// api to get all vehicles data
const showCars = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('vehiclesData');
        const cars = await collection.find().toArray();
        res.send(cars);
    } catch (error) {
        console.error('Error retrieving cars:', error);
        res.status(500).send('Error retrieving cars');
    }
};

const getFreeCarsForSearchResult = async (req, res) => {
    try {
        const db = await connectDB();
        const bookingsCollection = db.collection('bookings');
        const carsCollection = db.collection('vehiclesData');

        const { upazilla, area, selectedBrand, initailDate, initalTime, toDate, toTime } = req.query;
        const query = { brand: selectedBrand };

        if (area) {
            query['vehicleAvailableBookingArea.area'] = area;

        } else {
            query['vehicleAvailableBookingArea.upazilla'] = upazilla;
        }

        const car = await carsCollection.findOne(query);cons

        if (!car) {
            return res.status(200).send({ message: "No car found with the provided details" });
        }

        const carId = car?._id
        const carIdObject = carId;
        const carIdString = carIdObject.toString();
        const Id = carIdString.slice(0);

        const bookingQuery = {
            carId: Id,
            $or: [
                {
                    $and: [
                        { fromDate: { $lte: toDate } },  
                        { toDate: { $gte: initailDate } } 
                    ]
                },
                {
                    $and: [
                        { fromTime: { $lte: toTime } },
                        { toTime: { $gte: initalTime } } 
                    ]
                }
            ]
        };
       
        const existingBookings = await bookingsCollection.findOne(bookingQuery);
        if (existingBookings) {
            return res.status(404).send({ message: "No car found for this selected date" });
        }

        res.send(car).status(200);

    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching booked cars' });
    }
}

// api to get agency wise vehicle data
const getVehiclesAgency = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('vehiclesData');
        const id = req.params.agencyId;
        const query = { "agencyId": id }
        const vehicles = await collection.find(query).toArray();
        res.send(vehicles);
    }
    catch (error) {
        res.status(500).send('Error retrieving vehicles');
    }
}

const getVehicle = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('vehiclesData');
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const vehicle = await collection.findOne(query);
        res.send(vehicle);
    }
    catch (error) {
        res.status(500).send('Error retrieving vehicle.');
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



const getCarsByBrand = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('vehiclesData');
        const brand = req.params.brand;
        const query = { "brand": brand }
        const cars = await collection.find(query).toArray();
        res.send(cars);
    }
    catch (error) {
        res.status(500).send('Error retrieving vehicle.');
    }
}


module.exports = { showCars, getVehiclesAgency, getVehicle, getCarsByBrand, vehiclesInfo, getFreeCarsForSearchResult }
