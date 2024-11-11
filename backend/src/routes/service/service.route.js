import { Router } from "express";
import { createService, getService, getServiceById, getServiceByProductId} from "../../controllers/service/service.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const serviceRouter = Router();


// service routes
serviceRouter.route("/service/:id").post(verifyJWT, createService);
serviceRouter.route("/service/:id").get(verifyJWT, getServiceById);
serviceRouter.route("/services").get(verifyJWT, getService);
serviceRouter.route("/services/:id").get(verifyJWT, getServiceByProductId);

export {serviceRouter};