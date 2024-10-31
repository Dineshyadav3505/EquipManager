import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

export const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 60 * 60, // 1 hour
  // maxAge : 20 * 1000, // 20 seconds
  path: "/",
};
