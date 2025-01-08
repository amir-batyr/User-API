import express from "express";
import User from "../../models/user.js";
import bcrypt from "bcrypt";

const router = express.Router();

//Create new User
router.post("/signup", (req, res) => {
  (async function () {
    try {
      const user = await User.findOne({
        $or: [{ _id: req.body.username }, { email: req.body.email }],
      });
      if (user) {
        res.status(409).json({ message: "User already exists" });
      } else if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
          _id: req.body.username,
          email: req.body.email,
          password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({ message: "User Created!" });
      }
    } catch (err) {
      throw err;
    }
  })();
});

//signin
router.post("/signin", (req, res) => {
  (async function () {
    try {
      const user = await User.findOne({
        $and: [{ email: req.body.email }, { password: req.body.email }],
      });
      if (user) {
        res.status(409).json({ message: "User already exists" });
      } else if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
          _id: req.body.username,
          email: req.body.email,
          password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({ message: "User Created!" });
      }
    } catch (err) {
      res.status(500)
    }
  })();
});

export default router;
