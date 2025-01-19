import express from "express";
import userRoutes from "./routes/user.js";
import protectedRoutes from "./routes/protected.js";
import mongoose from "mongoose";
import helmet from "helmet";

//Connect to database
mongoose
  .connect("mongodb://0.0.0.0:27017/Postify")
  .then(() => console.log("Connected to databse!"))
  .catch(() => console.log("Connection failed!"));
const app = express();

// Use Helmet!
app.use(helmet());

app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/protected", protectedRoutes);
export default app;
