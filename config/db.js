// import mongoose from 'mongoose';

// export const connectToDb = async () => {
//     try {
//         // await mongoose.connect('mongodb://localhost:27017/college_closet', {
//             await mongoose.connect('mongodb://localhost:27017/college_closet_seed', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });
//         console.log('MongoDB connected successfully using Mongoose');
//     } catch (err) {
//         console.error('Failed to connect to MongoDB:', err);
//         process.exit(1);
//     }
// };


// db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // load .env file

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error("❌ ERROR: MONGODB_URI is missing from .env");
    process.exit(1);
}

export async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: "college_closet" // optional but recommended
        });

        console.log("✅ Connected to MongoDB successfully!");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    }
}


