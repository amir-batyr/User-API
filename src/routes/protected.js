import dotenv from "dotenv";
dotenv.config();

import express from "express";
import User from "../../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function validateToken(req, res, next) {
  //Get the JWT token from req
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(400).json({ error: "Authorization header not present" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(400).json({ error: "Token not present" });
  }
  //Verify the JWT
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
function refreshToken(req, res) {
  //Get the JWT token from req
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(400).json({ error: "Authorization header not present" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(400).json({ error: "Token not present" });
  }
  //Verify the refreshJWT
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, data) => {
    if (err) {
      return res.status(403).json({ error: "Token invalid or expired" });
    }
    const email = data.email;
    // Generate and send JWT tokens
    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "20s",
    });
    const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
    res
      .status(201)
      .json({ accessToken: accessToken, refreshToken: refreshToken });
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

// Access token refresh
router.get("/refresh", refreshToken);

export default router;
