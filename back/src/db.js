// import { connectDB } from './db.js'


// const mongoose = require("mongoose");
// require("dotenv").config();

// const dbHost = process.env.DB_HOST;

// const db = async() => {
//   //Realizar la conexion con la base de datos
//   await mongoose.connect(dbHost);
// };

// module.exports = db;

import mongoose from "mongoose";


export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost/mernbd");
    console.log("DB is connected")
  } catch (error) {
    console.log(error);
  }
};
