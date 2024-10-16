const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD   
    }
});

const sendOTPEmail = async (userEmail, otp) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: 'Your OTP Verification Code',
        text: `Your OTP code is: ${otp}. It is valid for 10 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Email sending failed');
    }
};

module.exports = { sendOTPEmail };