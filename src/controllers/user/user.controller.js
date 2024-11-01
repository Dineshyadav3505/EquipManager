import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from "../../models/user/user.model.js";
import { generateToken } from "../../utils/JwtToken.js";
import { options } from "../../utils/JwtToken.js";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";

const register = AsyncHandler(async (req, res, next) => {
  const { mail, phone, password, name } = req.body;

  const requiredFields = ["mail", "phone", "password", "name"];

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

// const updateProfile = AsyncHandler(async (req, res, next) => {
//   const { name, phone, mail, password } = req.body;

//   // Check for required fields
//   const requiredFields = ["name", "phone", "mail", "password"];
//   for (const field of requiredFields) {
//     if (!req.body[field] || req.body[field].trim() === "") {
//       throw new ApiError(
//         400,
//         `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
//       );
//     }
//   }

//   // Validate email
//   if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(mail)) {
//     throw new ApiError(400, "Invalid Email");
//   }

//   // Check if email already exists
//   const existingUser = await User.findOne({ mail });
//   if (existingUser) {
//     throw new ApiError(409, "Email already exists");
//   }

//   // Check if phone number already exists
//   const existing = await User.findOne({ phone });
//   if (existing) {
//     throw new ApiError(409, "Phone number already exists");
//   }

//   // Validate password length
//   if (password.length < 8 || password.length > 16) {
//     throw new ApiError(400, "Password must be between 8 and 16 characters");
//   }

//   // Hash password
//   const hashedPassword = await bcrypt.hash(password, 4);

//   // Update user profile
//   const updated = await User.findByIdAndUpdate(
//     { _id: req.user._id },
//     {
//       name,
//       phone,
//       mail,
//       password: hashedPassword,
//     }
//   );

//   if (!updated) {
//     throw new ApiError(500, "User profile not updated");
//   }

//   // Find the updated user without password
//   const updatedUser = await User.findById(req.user._id).select("-password");

//   // Send response
//   res
//     .status(200)
//     .json(
//       new ApiResponse(200, updatedUser, "User profile updated successfully")
//     );
// });

const updateMail = AsyncHandler(async (req, res, next) => {
  const { mail } = req.body;

  // Check for required fields
  const requiredFields = ["mail"];
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
    throw new ApiError(409, "Email already exists");
  }

  // Update user profile
  const updated = await User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      mail,
    }
  );

  if (!updated) {
    throw new ApiError(500, "User profile not updated");
  }

  // Find the updated user without password
  const updatedUser = await User.findById(req.user._id).select("-password");

  // Send response
  res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User profile updated successfully")
    );
});

const updatePhone = AsyncHandler(async (req, res, next) => {
  const { phone } = req.body;

  // Check for required fields
  const requiredFields = ["phone"];
  for (const field of requiredFields) {
    if (!req.body[field] || req.body[field].trim() === "") {
      throw new ApiError(
        400,
        `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      );
    }
  }

  // Check if phone number already exists
  const existing = await User.findOne({ phone });
  if (existing) {
    throw new ApiError(409, "Phone number already exists");
  }

  // Update user profile
  const updated = await User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      phone,
    }
  );

  if (!updated) {
    throw new ApiError(500, "User profile not updated");
  }

  // Find the updated user without password
  const updatedUser = await User.findById(req.user._id).select("-password");

  // Send response
  res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User profile updated successfully")
    );
});

const updateName = AsyncHandler(async (req, res, next) => {
  const { name } = req.body;

  // Check for required fields
  const requiredFields = ["name"];
  for (const field of requiredFields) {
    if (!req.body[field] || req.body[field].trim() === "") {
      throw new ApiError(
        400,
        `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      );
    }
  }

  // Update user profile
  const updated = await User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      name,
    }
  );

  if (!updated) {
    throw new ApiError(500, "User profile not updated");
  }

  // Find the updated user without password
  const updatedUser = await User.findById(req.user._id).select("-password");

  // Send response
  res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User profile updated successfully")
    );
});

const updatePassword = AsyncHandler(async (req, res, next) => {
  const { password } = req.body;

  // Check for required fields
  const requiredFields = ["password"];
  for (const field of requiredFields) {
    if (!req.body[field] || req.body[field].trim() === "") {
      throw new ApiError(
        400,
        `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      );
    }
  }

  // Validate password length
  if (password.length < 8 || password.length > 16) {
    throw new ApiError(400, "Password must be between 8 and 16 characters");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 4);

  // Update user profile
  const updated = await User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      password: hashedPassword,
    }
  );

  if (!updated) {
    throw new ApiError(500, "User profile not updated");
  }

  // Find the updated user without password
  const updatedUser = await User.findById(req.user._id).select("-password");

  // Send response
  res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User profile updated successfully")
    );
});

const deleteProfile = AsyncHandler(async (req, res, next) => {
  const deleted = await User.findByIdAndDelete({ _id: req.user._id });

  if (!deleted) {
    throw new ApiError(500, "User profile not deleted");
  }

  // Send response
  res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, req.user, "User profile deleted successfully"));
});

const getProfile = AsyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

export {
  register,
  login,
  logout,
  // updateProfile,
  updateMail,
  updatePhone,
  updateName,
  updatePassword,
  deleteProfile,
  getProfile,
};
