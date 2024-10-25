const connectDB = require("../config/db")
const { ObjectId } = require('mongodb');
const { generateAndStoreOTP } = require('../config/otpService');
const { sendOTPEmail } = require('../config/nodeMialer');

const showUsers = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');
        const { search } = req.query;
        const query = search ? {
            firstName: { $regex: search, $options: 'i' },
        } : {};

        const users = await collection.find(query).toArray();
        res.send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving users');
    }
}

const getUser = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');
        const email = req.params.email;
        const query = { "userEmail": email }
        const user = await collection.findOne(query);
        res.send(user);

    }
    catch (error) {
        res.status(500).send('Error retrieving user');
    }
}

const getAgencyImage = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const email = req.params.agencyEmail;
        const query = { "userEmail": email }
        const user = await collection.findOne(query);
        res.send(user);
    }
    catch (error) {
        console.log(error)
    }
}


const ownerInfo = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');
        const ownerData = req.body;
        const options = {
            ...ownerData,
            userRole: 'agency',
            accountStatus: 'not verified',
            emailVerified: 'not verified',
            creationTime: new Date().toISOString().split('T')[0]
        }
        const query = { userEmail: ownerData?.userEmail };
        const existUser = await collection.findOne(query);
        if (existUser) {
            return res.send({ message: "user already exists", insertedId: null });
        }

        const result = await collection.insertOne(options);
        if (result.insertedId) {
            const otp = await generateAndStoreOTP(ownerData?.userEmail);
            await sendOTPEmail(ownerData?.userEmail, otp)
            return res.send(result);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error inserting data', error });
    }
};

const driverInfo = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');
        const user = req.body;
        const options = {
            ...user,
            userRole: 'driver',
            accountStatus: 'not verified',
            emailVerified: 'not verified',
            creationTime: new Date().toISOString().split('T')[0]
        }
        const query = { userEmail: user?.userEmail };
        const existUser = await collection.findOne(query);
        if (existUser) {
            return res.send({ message: "user already exists", insertedId: null });
        }

        const result = await collection.insertOne(options);
        if (result.insertedId) {
            const otp = await generateAndStoreOTP(user?.userEmail);
            await sendOTPEmail(user?.userEmail, otp)
            return res.send(result);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error inserting data', error });
    }
};

const insertUser = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const user = req.body;
        const options = {
            ...user,
            userRole: 'user',
            accountStatus: 'not verified',
            drivingLicense: 'unavailable',
            creationTime: new Date().toISOString().split('T')[0]
        }
        const query = { userEmail: user?.userEmail };
        const existUser = await collection.findOne(query);
        if (existUser) {
            return res.send({ message: "user already exists", insertedId: null });
        }

        const result = await collection.insertOne(options);
        if (result.insertedId) {
            const otp = await generateAndStoreOTP(user?.userEmail);
            await sendOTPEmail(user?.userEmail, otp)
            return res.send(result);
        }
    }
    catch (error) {
        return res.status(500).send('Error retrieving user');
    }
}

const checkUser = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');
        const { phone, nid } = req.query;
        let phoneExists = false;
        let nidExists = false;

        const phoneCheck = await collection.findOne({ "phone": phone });
        const nidCheck = await collection.findOne({ "nid": nid });

        if (phoneCheck) {
            phoneExists = true
        }

        if (nidCheck) {
            nidExists = true
        }
        res.json({
            phoneExists,
            nidExists
        });
    } catch (error) {
        console.error('Error checking user existence', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const updateOne = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const email = req.params.email;
        const image = req.body;
        const query = { userEmail: email }
        const updateDoc = {
            $set: { image: image?.image }
        }
        const result = await collection.updateOne(query, updateDoc);
        res.send(result);
    }
    catch (error) {
        res.status(500).send('Error retrieving user');
    }
}

const updateStatus = async (req, res) => {

    const email = req.params.email;

    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const result = await collection.updateOne(
            { userEmail: email },
            { $set: { accountStatus: "verified" } }
        );

        if (result.modifiedCount > 0) {
            return res.send(result);
        } else {
            return res.status(404).send({ message: "User not found or no changes made." });
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send("Server error while updating account status.");
    }
}


// munia 
const updateStatusEmailVerified = async (req, res) => {

    const email = req.params.email;
    const { emailVerified } = req.body;

    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const result = await collection.updateOne(
            { userEmail: email },
            { $set: { emailVerified } }
        );

        if (result.modifiedCount > 0) {
            return res.send(result);
        } else {
            return res.status(404).send({ message: "User not found or no changes made." });
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send("Server error while updating account status.");
    }
}

const addOne = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const email = req.params.email;
        const image = req.body;
        const query = { userEmail: email };
        const updateDoc = {
            $set: { circleImage: image.userCropImage }
        };
        const result = await collection.updateOne(query, updateDoc);
        res.send(result);
    }
    catch (error) {
        res.status(500).send('Error retrieving user');
    }
}

const replaceData = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const email = req.params.email;
        const info = req.body;
        const query = { userEmail: email };

        const options = {
            ...info,
            userRole: 'user',
            accountStatus: 'not verified',
            drivingLicense: 'unavailable',
            creationTime: new Date().toISOString().split('T')[0]
        }
        const existUser = await collection.findOne(query);
        if (!existUser) {
            return res.send({ message: "This user info is not available", insertedId: null });
        }
        const result = await collection.replaceOne(query, options, { upsert: true });
        res.send(result);
    }
    catch (error) {
        res.status(500).send('Error retrieving user');
    }
}


const updateRole = async (req, res) => {
    const id = req.params.id;
    const { newRole } = req.body;
    const db = await connectDB();
    const collection = db.collection('users');

    if (!newRole) {
        return res.status(400).send({ message: 'New role is required' });
    }

    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
        $set: { userRole: newRole }
    };

    try {
        const result = await collection.updateOne(filter, updateDoc);
        if (result.modifiedCount === 1) {
            res.send({ message: 'Role updated successfully' });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

const deleteUser = async (req, res) => {
    const db = await connectDB();
    const collection = db.collection('users');
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: 'Invalid agency ID' });
    }

    try {
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
            res.status(200).send({ message: 'user deleted successfully' });
        } else {
            res.status(404).send({ message: 'user not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Error deleting user', error });
    }
};

const driverList = async (req, res) => {
    const role = req.query.role;

    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const query = role ? { userRole: role } : {};
        const result = await collection.find(query).toArray();

        console.log(result)
        res.send(result);

    }
    catch (error) {
        console.log(error)
    }
}

const getModerators = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const moderators = await collection.find({ userRole: 'moderator' }).toArray();
        res.status(200).json(moderators);

    } catch (error) {
        console.error("Error fetching moderators: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



module.exports = { showUsers, getUser, insertUser, updateOne, addOne, replaceData, ownerInfo, updateRole, checkUser, updateStatus, driverInfo, deleteUser, getModerators, updateStatusEmailVerified, driverList, getAgencyImage }
