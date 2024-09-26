// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     phone: { type: String, required: true },
//     photo: { type: String },
//     password: { type: String, required: true },
//     address: {
//         division: String,
//         district: String,
//         upazila: String,
//         area: String
//     },
//     nid: { type: Number, require: true}
// })

// const userLicenseCredential = new mongoose.Schema({
//     licenseNumber: { type: String, required: true, unique: true },
//     licenseType: { type: String, required: true },
//     licenseIssueDate: { type: Date, required: true },
//     licenseExpiryDate: { type: Date, required: true },
//     licenseStatus: { type: String, required: true },
//     nid: { type: Number, require: true }
// })

// const User = mongoose.model('User', userSchema);
// const UserLicenseCredential = mongoose.model('User', UserLicenseCredential);

// module.exports = { User, UserLicenseCredential };