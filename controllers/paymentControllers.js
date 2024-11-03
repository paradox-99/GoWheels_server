const connectDB = require("../config/db")
const { ObjectId } = require('mongodb')

const dotenv = require('dotenv');
const { default: axios } = require("axios");
const { sendEmail } = require('../config/nodeMialer');
const { io } = require('../index');


dotenv.config();

// const store_id = process.env.SSL_Store_ID
// const store_passwd = process.env.SSL_Store_Password
// const is_live = false //true for live, false for sandbox

const tran_id = new ObjectId().toString()

const order = async (req, res) => {
    try {
        const db = await connectDB()
        const collection = db.collection('vehiclesData')
        const paymentCollection = db.collection('payment')

        const paymentInfo = req.body;
        const { agencyEmail, agency_id, _id, userEmail, discount, drivingCost, method, totalRentHours, division, district, upazilla, area } = paymentInfo
        const query = { _id: new ObjectId(_id) };

        const carInfo = await collection.findOne(query)
        const price = carInfo.rentalPrice;

        const Cost = totalRentHours * price / 24;
        const calculatedCost = Math.ceil(Cost);

        let payablePrice = calculatedCost;

        if (method === "driver") {
            payablePrice = (calculatedCost + drivingCost) - discount
        }
        
    }
    catch (error) {
        res.status(500).send('Error payment');
    }
}

const paymentSuccess = async (req, res) => {
    try {
        const db = await connectDB();
        const paymentCollection = db.collection('payment');
        const paymentSuccess = async (req, res) => {
            try {
                const db = await connectDB();
                const paymentCollection = db.collection('payment');

                // Update the payment status using the correct field name "tranjectionId"
                const result = await paymentCollection.updateOne(
                    { tranjectionId: req.params.tranId }, // Using "tranjectionId" as in the document
                    { $set: { paidStatus: true } }
                );

                if (result.modifiedCount > 0) {
                    // Send the hardcoded email
                    await sendEmail(
                        'farzana.hossain147@gmail.com',
                        'John Doe',
                        'car123',
                        'Tesla Model S',
                        '2024-10-20'
                    );

                    // Redirect after successful update and email
                    return res.redirect(`http://localhost:5173/payment/success/${req.params.tranId}`);
                } else {
                    return res.status(404).send('Transaction not found or already updated.');
                }

            } catch (error) {
                console.error('Error processing payment:', error);
                res.status(500).send('Error processing payment');
            }
        };
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).send('Error processing payment');
    }
}

const paymentFail = async (req, res) => {
    try {
        const db = await connectDB()
        const paymentCollection = db.collection('payment')

        const result = await paymentCollection.deleteOne({ tranjectionId: req.params.tranId })

        if (result.deletedCount) {
            res.redirect(`http://localhost:5173/payment/fail/${req.params.tranId}`)
        }
    } catch (error) {
        res.status(500).send('Error payment');
    }
}

module.exports = { order, paymentSuccess, paymentFail }