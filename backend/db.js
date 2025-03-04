const mongoose = require("mongoose");
require("dotenv").config({ path: "./key.env" });

const mongoURI = process.env.MONGO_URI; // Load from env

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1); // Exit if connection fails
    }
};

// Export connection function
module.exports = connectToMongo;
