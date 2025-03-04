const mongoose = require("mongoose");
const User = require("./models/User"); // Ensure this path is correct

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/inotebook", { useNewUrlParser: true, useUnifiedTopology: true });

const fetchUsers = async () => {
    try {
        const users = await User.find().select("name email"); // Fetch names & emails
        console.log("Registered Users:");
        users.forEach(user => console.log(`${user.name} - ${user.email}`));
        mongoose.connection.close(); // Close connection after fetching
    } catch (error) {
        console.error("Error fetching users:", error);
    }
};

fetchUsers();
