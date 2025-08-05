import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, 
  name: { type: String, required: true, minlength: 2, maxlength: 60 },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: { type: String, required: true, match: /^\+380\d{9}$/ },
  position_id: { type: Number, required: true },
  position: { type: String, required: false },
  registration_timestamp: {
    type: Number,
    default: () => Math.floor(Date.now() / 1000),
  },
  photo: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

export default User;
