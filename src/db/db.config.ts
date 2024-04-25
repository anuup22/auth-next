import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI!); // just removed await!!
    const connection = mongoose.connection;

    connection.once('connected', () => {
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