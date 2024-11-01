import { Router } from "express";
import { register, login, logout, getProfile, updateProfile, deleteProfile,} from "../../controllers/user/user.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(verifyJWT ,logout);
router.route("/profile").get(verifyJWT, getProfile).put(verifyJWT, updateProfile).delete(verifyJWT, deleteProfile);

export default router;
