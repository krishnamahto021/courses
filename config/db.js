const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Successfully connected to the database`);
  } catch (error) {
    console.log(`error in connecting database ${error}`);
  }
};

module.exports = connectDB;
