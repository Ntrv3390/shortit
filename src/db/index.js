import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    if (!conn) {
      throw new Error("Database not connected. Please try again.");
    }
  } catch (error) {
    throw new Error("Error: " + error);
  }
};
