import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { User } from "../../models/user/user.model.js";
import { generateToken } from "../../utils/jwtToken.js";
import { options } from "../../utils/jwtToken.js";
import bcrypt from "bcryptjs";
import {
  generateVerificationCode,
  storeVerificationEmailCode,
  verifyCode,
} from "../../utils/verification.js";
import { sendEmail } from "../../utils/mailer.js";

const register = asyncHandler(async (req, res, next) => {
  const { mail, phone, password, name, code } = req.body;

  const requiredFields = ["mail", "phone", "password", "name", "code"];

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(mail)) {
    throw new apiError(400, "Invalid Email");
  }

  // Validate email
  const mailVerify = verifyCode(mail, code);

  if (!mailVerify) {
    throw new apiError(400, "Invalid verification code");
  }

  // Check for required fields
  for (const field of requiredFields) {
    if (!req.body[field] || req.body[field].trim() === "") {
      throw new apiError(
        400,
        `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      );
    }
  }

  // Check if email already exists
  const existingUser = await User.findOne({ mail });
  if (existingUser) {
    throw new apiError(409, "Email already exists", [], "Email already exists");
  }

  // Check if phone number already exists
  const existing = await User.findOne({ phone });
  if (existing) {
    throw new apiError(409, "Phone number already exists");
  }

  // Validate password length
  if (password.length < 8 || password.length > 16) {
    throw new apiError(400, "Password must be between 8 and 16 characters");
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
    throw new apiError(500, "User not registered");
  }

  // Generate access token
  const accessToken = generateToken(createdUser);

  // Set cookie and send response
  res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .json(
      new apiResponse(
        201,
        { createdUser, accessToken },
        "User created successfully"
      )
    );
});

const login = asyncHandler(async (req, res, next) => {
  const { mail, password } = req.body;

  // Check for required fields
  const requiredFields = ["mail", "password"];
  for (const field of requiredFields) {
    if (!req.body[field] || req.body[field].trim() === "") {
      throw new new apiError(
        400,
        `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      )();
    }
  }

  // Find user by email
  const user = await User.findOne({ mail });

  if (!user) {
    throw new apiError(401, "Invalid credentials");
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new apiError(401, "Invalid credentials");
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
  };
  // Set cookie and send response
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new apiResponse(200, userData, "User logged in successfully"));
});

const logout = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new apiResponse(200, req.user, "User logged out successfully"));
});

const getProfile = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new apiResponse(200, req.user, "User fetched successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const code = generateVerificationCode();
  storeVerificationEmailCode(email, code);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verification Code",
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <strong>${code}</strong></p>`,
  };

  const emailSent = await sendEmail(mailOptions);

  if (emailSent) {
    res
      .status(200)
      .json(new apiResponse(200, code, "Verification code sent successfully"));
  } else {
    res.status(500).json({ error: "Failed to send verification code" });
  }
});

const forgotPasswordVerifyEmail = asyncHandler(async (req, res) => {
  const { mail } = req.body;

  if (!mail) {
    return res.status(400).json(new apiError(400,{}, "Email is required"));
  }

  const user = await User.findOne({ mail });

  if (!user) {
    return res.status(404).json(new apiError(404, "User not exists"));
  }

  const code = generateVerificationCode();
  storeVerificationEmailCode(mail, code);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: mail,
    subject: "Reset Password",
    text: `Your Password reset code is: ${code}`,
    html: `<p>Your Password reset code is: <strong>${code}</strong></p>`,
  };

  const emailSent = await sendEmail(mailOptions);

  if (emailSent) {
    res
      .status(200)
      .json(new apiResponse(200, code, "Verification code sent successfully"));
  } else {
    res.status(500).json(new apiError(500, "Failed to send verification code"));
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { mail, code, newPassword } = req.body;

  const requiredFields = ["mail", "newPassword", "code"];

  // Validate email
  const mailVerify = verifyCode(mail, code);

  // Check for required fields
  for (const field of requiredFields) {
    if (!req.body[field] || req.body[field].trim() === "") {
      throw new apiError(
        400,
        `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      );
    }
  }

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(mail)) {
    throw new apiError(400, "Invalid Email");
  }

  if (!mailVerify) {
    throw new apiError(400, "Invalid verification code");
  }

  // Check if email already exists
  const existingUser = await User.findOne({ mail });
  if (!existingUser) {
    throw new apiError(404, "Email not exists", [], "Email not exists");
  }

  // Validate password length
  if (newPassword.length < 8 || newPassword.length > 16) {
    throw new apiError(400, "Password must be between 8 and 16 characters");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  const updatedUser = await User.findOne({ mail }).updateOne({
    password: hashedPassword,
  });

  if (!updatedUser) {
    throw new apiError(500, "Password not updated");
  }

  const userData = {
    _id: updatedUser._id,
    mail: updatedUser.mail,
    phone: updatedUser.phone,
    name: updatedUser.name,
    role: updatedUser.role,
  };

  res
    .status(200)
    .json(
      new apiResponse(200, userData , "Password updated successfully")
    );
});

export {
  register,
  login,
  logout,
  getProfile,
  verifyEmail,
  forgotPassword,
  forgotPasswordVerifyEmail,
};
