const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,  // This allows self-signed certificates
  },
});

const sendOTPEmail = async (userEmail, otp) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: "Your OTP Verification Code",
    text: `Your OTP code is: ${otp}. It is valid for 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Email sending failed");
  }
};

const sendEmail = async (userEmail, userName, carId, carModel, bookingDate) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: "Car Booking Confirmation",
    text: `Hello ${userName},\n\nYour booking for the car ${carModel} (ID: ${carId}) has been confirmed. Your booking is scheduled for ${bookingDate}.\n\nThank you for choosing GoWheels! Enjoy your ride!\n\nBest regards,\nGoWheels Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = { sendOTPEmail, sendEmail };
