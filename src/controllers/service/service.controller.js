import { apiError } from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { Service } from "../../models/Service/service.model.js";

const createService = asyncHandler(async (req, res, next) => {
    const { message, cost} = req.body;
    
    const userId = req.user._id;
    const productId = req.params.id;
    
    if (!userId) {
        throw new apiError(401, "You need to login to create a service");
    }
    
    const requiredFields = ["message", "cost"];
    
    // Check for required fields
    for (const field of requiredFields) {
        if (!req.body[field] || req.body[field].trim() === "") {
        throw new apiError(
            400,
            `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        );
        }
    }
    
    const service = await Service.create({
        message,
        cost,
        product: productId,
        user: userId,
    });
    
    res
        .status(201)
        .json(new apiResponse(201, { service }, "Service created successfully"));
});

const getServiceById = asyncHandler(async (req, res, next) => {

    const service = await Service.findById(req.params.id).populate("product").populate("user");

    if (!service) {
        throw new apiError(404, "Service not found");
    }

    res.status(200).json(new apiResponse(200, { service }, "Service fetched successfully"));
});



export { createService, getServicesAllServices, getServiceById };