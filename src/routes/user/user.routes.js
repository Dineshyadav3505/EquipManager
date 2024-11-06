import { Router } from "express";
import { register, login, logout, getProfile, verifyEmail, forgotPasswordVerifyEmail, forgotPassword} from "../../controllers/user/user.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
userRouter.route("/logout").get(verifyJWT ,logout);
userRouter.route("/profile").get(verifyJWT, getProfile);
userRouter.route("/verify-email").post(verifyEmail);
userRouter.route("/forgot-password").post(forgotPassword);
userRouter.route("/forgot-password/verify-email").post(forgotPasswordVerifyEmail);


export {userRouter};
              