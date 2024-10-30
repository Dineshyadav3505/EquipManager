import e from "express";
import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
    mail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 16,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      default: 'guest',
      enum: ['superAdmin', 'admin', 'user', 'guest', 'banned', 'client']
    },
});

const User = mongoose.model('User', userSchema);

export { User };