const connectDB = require("../config/db")
const { ObjectId } = require('mongodb')

const SSLCommerzPayment = require('sslcommerz-lts')

const dotenv = require('dotenv');
dotenv.config();

const store_id = 'gowhe6703a1593988b'
const store_passwd = 'gowhe6703a1593988b@ssl'
const is_live = false //true for live, false for sandbox

const tran_id = new ObjectId().toString()

const order = async (req, res) => {
    try {
        const db = await connectDB()
        const collection = db.collection('bookings')
        const paymentCollection = db.collection('payment')


        const product = await collection.findOne({ _id: new ObjectId(req.body.productId) })

        const order = req.body;


        const data = {
            total_amount: product?.totalPrice,
            currency: "BDT",
            tran_id: tran_id, // use unique tran_id for each api call
            success_url: `http://localhost:3000/api/payment/success/${tran_id}`,
            fail_url: `http://localhost:3000/api/payment/fail/${tran_id}`,
            cancel_url: 'http://localhost:3030/cancel',
            ipn_url: 'http://localhost:3030/ipn',
            shipping_method: 'Courier',
            product_name: 'Computer.',
            product_category: 'Electronic',
            product_profile: 'general',
            cus_name: order?.cus_name,
            cus_email: 'customer@example.com',
            cus_add1: order?.address,
            cus_add2: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
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
        };


        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
        sslcz.init(data).then(apiResponse => {
            // Redirect the user to payment gateway
            let GatewayPageURL = apiResponse.GatewayPageURL
            res.send({ url: GatewayPageURL })


            const finalOrder = {
                product, paidStatus: false, tranjectionId: tran_id
            }

            const result = paymentCollection.insertOne(finalOrder)
        });

    }
    catch (error) {
        res.status(500).send('Error payment');
    }
}

const paymentSuccess = async (req, res) => {
    try {
        const db = await connectDB()
        const paymentCollection = db.collection('payment')

        const result = await paymentCollection.updateOne({ tranjectionId: req.params.tranId }, {
            $set: {
                paidStatus: true,
            }
        })
        if (result.modifiedCount > 0) {
            res.redirect(`http://localhost:5173/payment/success/${req.params.tranId}`)
        }

    } catch (error) {
        res.status(500).send('Error payment');
    }
}

const paymentFail = async (req, res) => {
    try {

        const db = await connectDB()
        const paymentCollection = db.collection('payment')

        const result = await paymentCollection.deleteOne({ tranjectionId: req.params.tranId })

        if(result.deletedCount){
            res.redirect(`http://localhost:5173/payment/fail/${req.params.tranId}`)
        }

    } catch (error) {
        res.status(500).send('Error payment');
    }
}

module.exports = { order, paymentSuccess, paymentFail }
