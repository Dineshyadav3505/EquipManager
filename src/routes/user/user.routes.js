import { Router } from "express";
import { register, login, logout, getProfile, verifyEmail, forgotPasswordVerifyEmail, forgotPassword} from "../../controllers/user/user.controller.js";
import { createProduct, getProductById, getProductsAllProducts, updateProduct, deleteProduct } from "../../controllers/product/product.controller.js";
import { createService, getService, getServiceById, getServiceByProductId} from "../../controllers/service/service.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(verifyJWT ,logout);
router.route("/profile").get(verifyJWT, getProfile);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/forgot-password/verify-email").post(forgotPasswordVerifyEmail);

// product routes
router.route("/product").post(verifyJWT, createProduct);
router.route("/products").get(verifyJWT, getProductsAllProducts);
router.route("/product/:id").get(verifyJWT, getProductById);
router.route("/product/:id").put(verifyJWT, updateProduct);
router.route("/product/:id").delete(verifyJWT, deleteProduct);

// service routes
router.route("/service/:id").post(verifyJWT, createService);
router.route("/service/:id").get(verifyJWT, getServiceById);
router.route("/services").get(verifyJWT, getService);
router.route("/services/:id").get(verifyJWT, getServiceByProductId);

export default router;
              