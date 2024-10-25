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

        const initialData = {
            store_id: "gowhe6703a1593988b",
            store_passwd: "gowhe6703a1593988b@ssl",
            total_amount: payablePrice,
            currency: "BDT",
            tran_id: tran_id, 
            success_url: `http://localhost:3000/api/payment/success`,
            fail_url: `http://localhost:3000/api/payment/fail`,
            cancel_url: 'http://localhost:3030/cancel',
            ipn_url: 'http://localhost:3030/ipn',
            shipping_method: 'Courier',
            car_name: 'Computer.',
            car_category: 'Electronic',
            car_profile: 'general',
            cus_name: "cus_name",
            cus_email: userEmail,
            cus_add1: division,
            cus_add2: district,
            cus_city: upazilla,
            cus_state: area ? area : 'no area',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: '01711111111',
            cus_fax: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'Dhaka',
            ship_add2: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
            product_name: carInfo.brand,
            product_category: "product_category",
            product_profile: "product_profile"
        };
return
        const response = await axios({
            method: "POST",
            url: `https://sandbox.sslcommerz.com/gwprocess/v4/api.php`,
            data: initialData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })

        console.log("response : ", response?.data?.GatewayPageURL)
        res.send({ url: response?.data?.GatewayPageURL })
        console.log("response : ", response?.data?.GatewayPageURL)
        res.send({ url: response?.data?.GatewayPageURL })

        const finalOrder = {
            car, paidStatus: false, tranjectionId: tran_id,
        }
        const result = paymentCollection.insertOne(finalOrder)
        
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