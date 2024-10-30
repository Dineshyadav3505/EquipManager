import { Router } from "express";
import { register, login } from "../../controllers/user/user.controller.js";

const router = Router();


router.route("/register").post(register);
router.route("/login").post(login);


export default router;