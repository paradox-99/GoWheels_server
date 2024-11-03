const connectDB = require("./db")

const generateAndStoreOTP = async (userEmail) => {

    const db = await connectDB();
    const collection = db.collection('otp');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpDetails = {
        otp,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 2 * 60 * 1000),
    };

    try {
        await collection.insertOne({ userEmail, ...otpDetails });
        return otp
    } catch (error) {
        console.error('Error generating or storing OTP:', error);
        throw new Error('Failed to generate or store OTP');
    }
};

const generateOTP = async (userEmail) => {
    const db = await connectDB();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
}

module.exports = { generateAndStoreOTP, generateOTP };

