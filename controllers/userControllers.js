const connectDB = require("../config/db")
const { ObjectId } = require('mongodb');

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

const ownerInfo = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');
        const ownerData = req.body;
        const result = await collection.insertOne(ownerData);
        res.status(201).json({ message: 'Data inserted successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error inserting data', error });
    }
};

const driverInfo = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');
        const ownerData = req.body;
        const result = await collection.insertOne(ownerData);
        res.status(201).json({ message: 'Data inserted successfully', result });
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
        }
        const query = { userEmail: user?.userEmail };
        const existUser = await collection.findOne(query);
        if (existUser) {
            return res.send({ message: "user already exists", insertedId: null });
        }

        const result = await collection.insertOne(options);
        res.send(result);
    }
    catch (error) {
        res.status(500).send('Error retrieving user');
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




// Update user role by admin
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

    // Check if the id is a valid ObjectId
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

const getModerators = async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('users');

        // Find all users with role "moderator"
        const moderators = await collection.find({ userRole: 'moderator' }).toArray();

        res.status(200).json(moderators);
    } catch (error) {
        console.error("Error fetching moderators: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


 
module.exports = { showUsers, getUser, insertUser, updateOne, addOne, replaceData, ownerInfo, updateRole, deleteUser, getModerators,driverInfo }