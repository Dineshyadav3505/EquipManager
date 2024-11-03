import e from "express";
import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({
    siteName: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ["laptop", "smartphone", "tablet", "desktop", "others"],
        required: true,
    },
    modelNumber: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
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