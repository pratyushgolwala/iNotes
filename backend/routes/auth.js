const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchUser = require('../middleware/fetchUser');
const cors = require('cors');

const JWT_SECRET = 'Harryisagoodb$oy';

// Allow cookies to be set from frontend
router.use(cors({ credentials: true, origin: 'http://localhost:3000' })); 

// Middleware to parse cookies
const cookieParser = require('cookie-parser');
router.use(cookieParser());

// ROUTE 1: Create a User
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    });

    const data = { user: { id: user.id } };
    const authtoken = jwt.sign(data, JWT_SECRET, { expiresIn: "1h" });

    // Send token as an HTTP-only cookie
    res.cookie("token", authtoken, {
      httpOnly: true,
      secure: false, // Set to true in production (only for HTTPS)
      sameSite: "Strict",
      maxAge: 3600000, // 1 hour
    });

    res.json({ success: true, user: { name: user.name, email: user.email } });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Login User and Set Cookie
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const data = { user: { id: user.id } };
    const authtoken = jwt.sign(data, JWT_SECRET, { expiresIn: "1h" });

    // Send token as a cookie
    res.cookie("token", authtoken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 3600000,
    });

    res.json({ success: true, user: { name: user.name, email: user.email } });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 3: Logout User (Clear Cookie)
router.post('/logout', (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
});

// ROUTE 4: Get Logged-in User
router.get("/getuser", fetchuser, async (req, res) => {
  try {
      const userId = req.user.id; // Extract user ID from token
      const user = await User.findById(userId).select("name email"); // Fetch user
      res.json(user);
  } catch (error) {
      console.error("Error fetching user:", error.message);
      res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
