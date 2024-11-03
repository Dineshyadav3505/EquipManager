import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from "../../models/user/user.model.js";
import { generateToken } from "../../utils/JwtToken.js";
import { options } from "../../utils/JwtToken.js";
import bcrypt from "bcryptjs";
import {
  generateVerificationCode,
  storeVerificationCode,
} from "../../utils/verification.js";
import { sendEmail } from "../../utils/mailer.js";

const register = AsyncHandler(async (req, res, next) => {
  const { mail, phone, password, name, code } = req.body;

  const requiredFields = ["mail", "phone", "password", "name", "code"];

  // Check for required fields
  for (const field of requiredFields) {
    if (!req.body[field] || req.body[field].trim() === "") {
      throw new ApiError(
        400,
        `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      );
    }
  }

  // Validate email
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(mail)) {
    throw new ApiError(400, "Invalid Email");
  }

  // Check if email already exists
  const existingUser = await User.findOne({ mail });
  if (existingUser) {
    throw new ApiError(409, "Email already exists", [], "Email already exists");
  }

  // Check if phone number already exists
  const existing = await User.findOne({ phone });
  if (existing) {
    throw new ApiError(409, "Phone number already exists");
  }

  // Validate password length
  if (password.length < 8 || password.length > 16) {
    throw new ApiError(400, "Password must be between 8 and 16 characters");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = await User.create({
    mail,
    password: hashedPassword,
    phone,
    name,
  });

  // Find the created user without password
  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "User not registered");
  }

  // Generate access token
  const accessToken = generateToken(createdUser);

  // Set cookie and send response
  res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        201,
        { createdUser, accessToken },
        "User created successfully"
      )
    );
});

const login = AsyncHandler(async (req, res, next) => {
  const { mail, password } = req.body;

  // Check for required fields
  const requiredFields = ["mail", "password"];
  for (const field of requiredFields) {
    if (!req.body[field] || req.body[field].trim() === "") {
      throw new new ApiError(
        400,
        `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      )();
    }
  }

  // Find user by email
  const user = await User.findOne({ mail });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate access token
  const accessToken = generateToken(user);

  // Create a user object without sensitive data
  const userData = {
    _id: user._id,
    mail: user.mail,
    phone: user.phone,
    name: user.name,
    role: user.role,
    isVerified: user.isVerified,
  };
  // Set cookie and send response
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, userData, "User logged in successfully"));
});

const logout = AsyncHandler(async (req, res, next) => {
  res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, req.user, "User logged out successfully"));
});

const getProfile = AsyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const verifyEmail = AsyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const code = generateVerificationCode();
  storeVerificationCode(email, code);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verification Code",
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <strong>${code}</strong></p>`,
  };

  const emailSent = await sendEmail(mailOptions);

  if (emailSent) {
    res.status(200).json(new ApiResponse(200, code, "Verification code sent successfully"));
  } else {
    res.status(500).json({ error: "Failed to send verification code" });
  }
});

export { register, login, logout, getProfile, verifyEmail };
