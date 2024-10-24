const connectDB = require("../config/db");
const { ObjectId } = require('mongodb');

// Create a car review -m
const createCarReview = async (req, res) => {
    try {
        console.log("mk car review");
        const db = await connectDB();
        const carReviewsCollection = db.collection('reviews');

        const { userId,agency_id, carId, userName, userImage, carName, carImage, review, rating, agencyResponse } = req.body;
        // console.log(req.body);

        const newReview = {
            userId,
            carId,
            carName,
            review,
            rating,
            userName,
            userImage,
            reviewImage: carImage,
            agency_id,
            agencyResponse,
            date: new Date()
        };
        console.log(newReview);
        // Insert new review -m
        await carReviewsCollection.insertOne(newReview);

        res.status(200).send({ message: "Review created successfully." });
    } catch (error) {
        res.status(500).send({ message: 'Error creating review' });
    }
};

// Get reviews for a specific car or specifiq user -m

const getCarReviews = async (req, res) => {
    try {
        const db = await connectDB();
        const carReviewsCollection = db.collection('reviews');

        const carId = req.params.carId;
        const user = req.query.user === 'true';
        const agency = req.query.agency === 'true';
        console.log(user);
        let query = {
            carId: carId,
        }
        if (user) {
            query =
            {
                userId: req.params.carId,
            }
        }
        if (agency) {
            query =
            {
                agency_id: req.params.carId,
            }
        }
        console.log(query);
        // Fetch reviews for the car -m
        const reviews = await carReviewsCollection.find(query).toArray();

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
const updateCarReview = async (req, res) => {
    
    try {
        const db = await connectDB();
        const carReviewsCollection = db.collection('reviews');

        const reviewId = req.params.reviewId;
        console.log(reviewId);
        const agency = req.query.agency === 'true';
        const { review, rating, agencyResponse } = req.body;
        
        let updatedReview = {
            review,
            rating,
            agencyResponse,
            date: new Date(),
        };
        if (agency) {
            updatedReview = {
                agencyResponse: agencyResponse
            }
        }
        console.log("updated review",updatedReview, agency);

        const result = await carReviewsCollection.updateOne(
            { _id: new ObjectId(reviewId) },
            { $set: updatedReview }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        res.send(result)
    } catch (error) {
        res.status(500).json({ message: 'Error updating review', error });
    }
};

module.exports = { createCarReview, getCarReviews, updateCarReview };
