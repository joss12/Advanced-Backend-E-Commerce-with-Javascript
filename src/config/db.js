

import mongoose from 'mongoose';
import colors from 'colors';


export const connectDB = async()=>{
    try {
        // const {connection} = await mongoose.connect
        const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}?retryWrites=true&w=majority`
        mongoose.connect(mongoUri).then(()=>{
            console.log('->Database connected...'.yellow)
        })
    } catch (error) {
        console.log('Connection failed', error, error.stack);
        process.exit(1);
    }
}