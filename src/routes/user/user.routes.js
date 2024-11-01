import { Router } from "express";
import { register, login, logout, getProfile, updateProfile, deleteProfile, updateMail, updateName, updatePhone, updatePassword} from "../../controllers/user/user.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(verifyJWT ,logout);
router.route("/profile").get(verifyJWT, getProfile).put(verifyJWT, updateProfile).delete(verifyJWT, deleteProfile);
router.route("/profile/mail").put(verifyJWT, updateMail);
router.route("/profile/name").put(verifyJWT, updateName);
router.route("/profile/phone").put(verifyJWT, updatePhone);
router.route("/profile/password").put(verifyJWT, updatePassword);

export default router;
