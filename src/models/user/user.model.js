import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  mail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    default: "guest",
    enum: ["superAdmin", "admin", "user", "guest", "banned", "client"],
  }
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

export { User };
