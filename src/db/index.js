import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({});
const { DB_PASSWORD } = process.env;

const dbUri = `mongodb+srv://mongodbusername:${DB_PASSWORD}@cluster0.kyvt8xh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

export const db = async () => {
  try {
    const result = await mongoose.connect(dbUri);
    if (result) {
      console.log("db connection established");
    }
  } catch (error) {
    console.error("db connection failed", error);
  }
};
