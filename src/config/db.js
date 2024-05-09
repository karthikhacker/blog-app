import mongoose from 'mongoose';
import 'dotenv/config'

export const dbConnection = async () => {
    try {
        let mongo_url = process.env.MONGO_URL;
        await mongoose.connect(mongo_url);
        console.log('DATABASE CONNECTED...')
    } catch (error) {
        console.log(error.name, error.message)
    }

}