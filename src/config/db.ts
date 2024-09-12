import { connect } from "mongoose"
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
    try {
        await connect(process.env.MONGODB_URL!)
        console.log('MongoDB connected successfully!');
    } catch (err: any) {
        console.log('Failed to connect to MongoDB', err);
        process.exit(1)
    }
}