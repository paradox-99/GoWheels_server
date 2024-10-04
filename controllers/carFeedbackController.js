const connectDB = require("../config/db");
const { ObjectId } = require('mongodb');

// Create a car review -m
const createCarReview = async (req, res) => {
    try {
        const db = await connectDB();
        const carReviewsCollection = db.collection('carReviews');

        const { carId, userName, userImage, review, rating, agencyResponse } = req.body;

        // Check if required fields are present
        if (!carId || !userId || !review || !rating || !car_rent_date_from || !car_rent_date_to) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newReview = {
            carId: new ObjectId(carId),
            review,
            rating,
            userName,
            userImage,
            agencyResponse,
            date: new Date()
        };

        // Insert new review -m
        await carReviewsCollection.insertOne(newReview);

        res.status(201).send({ message: "Review created successfully." });
    } catch (error) {
        res.status(500).send({ message: 'Error creating review' });
    }
};

// Get reviews for a specific car -m
const getCarReviews = async (req, res) => {
    try {
        const db = await connectDB();
        const carReviewsCollection = db.collection('reviews');
        
        const carId = req.params.carId;
        
        // Fetch reviews for the car -m
        const reviews = await carReviewsCollection.find({ carId }).toArray();
        
        if (!reviews.length) {
            return res.status(404).send({ message: 'No reviews found for this car.' });
        }
        
        //  TODO : if we decide that user data will come from user collection for less storage -m
        
        // const reviewsWithUserInfo = await Promise.all(reviews.map(async (review) => {
            //     const user = await usersCollection.findOne({ _id: new ObjectId(review.userId) }, { projection: { firstName: 1, lastName: 1, image: 1 } });
            //     return {
                //         ...review,
                //         userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown User',
                //         userImage: user ? user.image : '##' // Fallback image 
                //     };
                // }));
                

        // console.log(reviews);
                res.status(200).send(reviews);
            } catch (error) {
        res.status(500).send({ message: 'Error fetching car reviews' });
    }
};

module.exports = { createCarReview, getCarReviews };
