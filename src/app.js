import express from "express";
import userRoutes from "./routes/user.js";
import mongoose from "mongoose";

mongoose
  .connect("mongodb://0.0.0.0:27017/Postify")
  .then(() => console.log("Connected to databse!"))
  .catch(() => console.log("Connection failed!"));
const app = express();

app.use(express.json());
app.use("/api/user", userRoutes);

export default app;
