import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
