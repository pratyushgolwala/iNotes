const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const User = require("../models/User");

// Route to get logged-in user's details
router.get("/getuser", fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password"); // Exclude password
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
