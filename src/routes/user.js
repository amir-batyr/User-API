//Get Env Variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import User from "../../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function generateAccessToken(email) {
  return jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1800s",
  });
}

const router = express.Router();

//Create new User
router.post("/signup", async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });
    if (user) {
      res.status(409).json({ message: "User already exists" });
    } else if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(201).json({ message: "User Created!" });
    }
  } catch (err) {
    res.status(500);
    throw err;
  }
});

//signin
router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (user) {
      const match = await bcrypt.compare(req.body.password, user.password);
      if (match) {
        const accessToken = generateAccessToken({ email: req.body.email });
        res.status(200).json({ accessToken: accessToken });
      } else if (!match) {
        res.status(401).json({ accessToken: false });
      }
    } else if (!user) {
      res.status(401).json({ accessToken: false });
    }
  } catch (err) {
    res.status(500);
    throw err;
  }
});

//Check if username avaliable
router.post("/username", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });
    if (user) {
      res.status(200).json({ exists: true });
    } else if (!user) {
      res.status(200).json({ exists: false });
    }
  } catch (err) {
    res.status(500);
    throw err;
  }
});

export default router;
