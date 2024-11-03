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
        // const agencies = db.collection('agencyData');

        const { fromDate, fromTime, untilDate, untilTime, upazilla, keyArea } = req.query;

        let query;

        // if (keyArea) {
        //     query = { "agencyAddress.keyArea": keyArea };
        // } else {
        //     query = { "agencyAddress.upazilla": upazilla };
        // }
        // const Agencies = await agencies.find(query).project({agency_id: 1}).toArray();

        // if (!Agencies) {
        //     return res.status(200).send({ message: "No car found on your location." });
        // }

        const date = `${fromDate}T${fromTime}`
        const queryDate = new Date(date);

        if (keyArea) {
            query = { 'vehicleAvailableBookingArea.area': keyArea };
        } else {
            query = { 'vehicleAvailableBookingArea.upazilla': upazilla };
        }

        const cars = await carsCollection.find(query).toArray();

        if (!cars) {
            return res.status(200).send({ message: "No car found on your search location." });
        }

        await Promise.all(
            cars.map(async (car) => {
                const carId = car._id.toString();

                const bookingQuery = {
                    $and: [
                        { carId: carId },
                        { dropoffDate: { $lt: queryDate } }
                    ]
                };

                const existingBookings = await bookingsCollection.findOne(bookingQuery);
                if (!existingBookings) {
                    const index = cars.indexOf(car);
                    cars.splice(index, 1);
                }
            })
        );

        res.send(cars).status(200);
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
        if (!cars) {
            res.status(204).send("Sorry. Currently no available.")
        }
        res.send(cars);
    }
    catch (error) {
        res.status(500).send('Error retrieving vehicle.');
    }
}

const getCarsByLocation = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('vehiclesData');
        const { district, upazilla } = req.query;
        let query;
        if (district) {
            query = { "vehicleAvailableBookingArea.district": district };
        }
        else if (upazilla) {
            query = { "vehicleAvailableBookingArea.upazilla": upazilla };
        }

        const cars = await collection.find(query).toArray();
        if (!cars) {
            res.status(204).send("Sorry. Currently no available.")
        }
        res.send(cars);
    } catch (error) {
        res.status(500).send('Error retrieving vehicle.');
    }
}

module.exports = { showCars, getVehiclesAgency, getVehicle, getCarsByBrand, vehiclesInfo, getFreeCarsForSearchResult, getCarsByLocation }
