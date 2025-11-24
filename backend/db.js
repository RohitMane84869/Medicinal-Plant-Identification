import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
  const MONGODB_URI = 'mongodb+srv://rohitsmane57_db_user:lvgBC1W0383iJLrI@cluster0.jas7qak.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
 
console.log('MongoDB URI:', process.env.MONGODB_URI);
const connectDB = async () => {
  try {
    await mongoose.connect(  MONGODB_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/herbai');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;