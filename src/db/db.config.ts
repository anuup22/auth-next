import { connect } from "http2";
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;

    connection.on('connected', () => {
      console.log('Connected to MongoDB');
    });
    connection.on('error', (error) => {
      console.error('Error connecting to MongoDB', error);
      process.exit(1); // Exit with failure
    });
  } 
  catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};