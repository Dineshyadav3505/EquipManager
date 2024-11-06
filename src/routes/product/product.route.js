import { Router } from "express";
import { createProduct, getProductById, getProductsAllProducts, updateProduct, deleteProduct } from "../../controllers/product/product.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const productRouter = Router();

// product routes
productRouter.route("/product").post(verifyJWT, createProduct);
productRouter.route("/products").get(verifyJWT, getProductsAllProducts);
productRouter.route("/product/:id").get(verifyJWT, getProductById);
productRouter.route("/product/:id").put(verifyJWT, updateProduct);
productRouter.route("/product/:id").delete(verifyJWT, deleteProduct);


export {productRouter};