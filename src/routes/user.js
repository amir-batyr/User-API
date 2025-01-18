// Get Env Variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import User from "../../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Function to generate a JWT access token
function generateAccessToken(email) {
  return jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1800s",
  });
}

const router = express.Router();

// Signup endpoint
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate and send JWT token
    const accessToken = generateAccessToken({ email });
    res.status(201).json({ accessToken });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Signin endpoint
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate and send JWT token
    const accessToken = generateAccessToken({ email });
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Username availability check endpoint
router.post("/username", async (req, res) => {
  try {
    const { username } = req.body;

    // Check if username exists
    const user = await User.findOne({ username });
    res.status(200).json({ exists: !!user });
  } catch (error) {
    console.error("Username check error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

