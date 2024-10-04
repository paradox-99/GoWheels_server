const { MongoClient, ServerApiVersion } = require('mongodb')
require('dotenv').config()

const uri = `mongodb+srv://${process.env.db_Name}:${process.env.db_Password}@cluster0.jgkyr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const connectDB = async () => {
    try {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        await client.connect();
        const db = client.db('GoWheels');
        console.log('MongoDB connected');
        return db;
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;




// const connectDB = async () => {

//     try {
//         if (cachedDb) {
//             return cachedDb;
//         }
//         if (!cachedClient) {
//             cachedClient = new MongoClient(uri, {
//                 serverApi: {
//                     version: ServerApiVersion.v1,
//                     strict: true,
//                     deprecationErrors: true,
//                 }
//             });
//             await cachedClient.connect();
//         }
//         cachedDb = cachedClient.db();
//         return cachedDb;
//     }
//     catch (error) {
//         console.error(`Error: ${error.message}`);
//         process.exit(1);
//     }
// }

// const getCollection = async (collectionName) => {
//     const db = await connectDB();
//     return db.collection(collectionName);
// };