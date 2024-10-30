import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from "../../models/User.js";

const option = {
    httpOnly: true,
    secure: true
};

const generateAccessToken = async (userId) => {
    try {
      const user = await User.findById(userId);
      const accessToken = user.generateAccessToken();
  
      return { accessToken };
  
    } catch (error) {
      throw new ApiError(500, "Access Token generation failed");
    }
};

const register = AsyncHandler(async (req, res, next) => {
    const { mail, phone, password, name } = req.body;

    const requiredFields = ['mail', 'phone', 'password', 'name'];

    for (const field of requiredFields) {
        if (req.body[field]?.trim() === "") {
            throw new ApiError(400, `${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
    }
    
    const userEmail = await User.findOne({ mail });
    if (userEmail) {
      throw new ApiError(409, "Email already exists");
    }



  //sadfugh lasfdb

    if(password.length < 8 || password.length > 16){
        throw new ApiError(400, "Password must be between 8 and 16 characters");
    }
  
    const user = await User.create({
        mail,
        password,
    });
    
    const createdUser = await User.findById(user._id).select("-password");
    
    if (!createdUser) {
        throw new ApiError(500, "Email not Registered");
    }
    
    const {accessToken} = await generateAccessToken(user._id);
    
    return res
    .status(201)
    .cookie("accessToken", accessToken, option)
    .json(
        new ApiResponse(201,
        {
            createdUser,accessToken
        }, "User created successfully")
    );
});


export { register };