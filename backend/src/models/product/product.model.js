import e from "express";
import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({
    siteName: {
        type: String,
        lowercase: true,
        required: true,
    },
    category: {
        type: String,
        lowercase: true,
        required: true,
    },
    modelNumber: {
        type: String,
        lowercase: true,
        required: true,
    },
    brand: {
        type: String,
        lowercase: true,
        required: true,
    },
    warrantyDate: {
        type: Date,
        required: true,
    },
    image:[{
        type: String,
        required: true,
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});

const Product = mongoose.model("Product", ProductSchema);

export { Product };