const connectDB = require("../config/db")

const showReviewsAndRatings = async(req, res) => {
    try{
        const db = await connectDB();
        const collection = db.collection('reviewsAndRating');
        const reviews = await collection.find().toArray();
        res.send(reviews);
    }
    catch(error) {
        res.status(500).send( 'Error retrieving reviews');
    }
}

module.exports = {showReviewsAndRatings}                  