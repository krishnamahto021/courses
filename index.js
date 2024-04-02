const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
connectDB();

const passportJwtStrategy = require("./config/passport-jwt-strategy");

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use("/api/v1", require("./routes/index"));

const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server is running on the port ${PORT}`));
