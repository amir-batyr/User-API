import dotenv from "dotenv";
dotenv.config();

import express from "express";
import User from "../../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function validateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(400).json({ error: "Authorization header not present" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(400).json({ error: "Token not present" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
    if (err) {
      return res.status(403).json({ error: "Token invalid or expired" });
    }

    try {
      const user = await User.findOne({ email: data.email });
      if (!user) {
        return res.status(403).json({ error: "Token invalid or expired" });
      }

      req.username = user.username;
      next();
    } catch (dbError) {
      console.error("Database error:", dbError);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

const router = express.Router();

// Get the authenticated user's username
router.get("", validateToken, (req, res) => {
  try {
    res.status(200).json({ username: req.username });
  } catch (err) {
    console.error("Error in GET /:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
