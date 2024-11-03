import { Router } from "express";
import { register, login, logout, getProfile, verifyEmail, forgotPasswordVerifyEmail, forgotPassword} from "../../controllers/user/user.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(verifyJWT ,logout);
router.route("/profile").get(verifyJWT, getProfile);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/forgot-password/verify-email").post(forgotPasswordVerifyEmail);

export default router;
