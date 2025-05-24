// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

// [SECTION] Routes
const userRoutes = require("./routes/user");
const workoutRoutes = require("./routes/workout");

// [SECTION] Environment Setup
const app = express();
const corsOptions = {
    origin: ['http://localhost:3000'], // Adjust this based frontend URL (for future reference)
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// [SECTION] Database Connection
mongoose.connect(process.env.MONGODB_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas."));
mongoose.connection.on('error', (err) => console.error("MongoDB connection error:", err));

// [SECTION] Backend Routes
app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes);

// [SECTION] Error Handling Middleware
const { errorHandler } = require('./auth');
app.use(errorHandler);

// [SECTION] Server Gateway Response
if (require.main === module) {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`API is now online on port ${process.env.PORT || 5000}`);
    });
}

// Export the app and mongoose for testing or external use
module.exports = { app, mongoose };