import { apiError } from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { Product } from "../../models/product/product.model.js";

const createProduct = asyncHandler(async (req, res, next) => {
  const { siteName, category, modelNumber, brand, warrantyDate, image } =
    req.body;

  const userId = req.user._id;

  if (!userId) {
    throw new apiError(401, "You need to login to create a product");
  }

  //   if (req.user.role !== "superAdmin" && req.user.role !== "admin") {
  //     throw new apiError(403, "Unauthorized request");
  //   }

  const requiredFields = [
    "siteName",
    "category",
    "modelNumber",
    "brand",
    "warrantyDate",
    "image",
  ];

  // Check for required fields
  for (const field of requiredFields) {
    if (!req.body[field] || req.body[field].trim() === "") {
      throw new apiError(
        400,
        `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      );
    }
  }

  //   if (!req.files || !req.files.image) {
  //     throw new apiError(400, "Product image is required");
  //   }

  const product = await Product.create({
    siteName,
    category,
    modelNumber,
    brand,
    warrantyDate,
    image,
    user: req.user._id,
  });

  res
    .status(201)
    .json(new apiResponse(201, { product }, "Product created successfully"));
});

const getProductsAllProducts = asyncHandler(async (req, res, next) => {
  const { siteName, category, modelNumber, brand } = req.query;

  const query = {};

  if (siteName) query.siteName = siteName;
  if (category) query.category = category;
  if (modelNumber) query.modelNumber = modelNumber;
  if (brand) query.brand = brand;

  try {
    const products = await Product.find(query);

    res.status(200).json(new apiResponse(200, { products }));
  } catch (error) {
    throw new apiError(500, "Error fetching products");
  }
});



export { createProduct, getProductsAllProducts };
