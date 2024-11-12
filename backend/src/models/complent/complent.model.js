import mongoose, { Schema } from "mongoose";

const complentSchema = new Schema({
    message: {
        type: String,
        lowercase: true,
        required: true,
    },
    location: {
        type: String,
        lowercase: true,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    altPhone: {
        type: String,
    },
    productName: {
        type: String,
        required: true,
    },
    productModel: {
        type: String,
        required: true,
    },
    productBrand: {
        type: String,
        required: true,
    },
    invoiceCopy:{
        type: String,
    },
    productImage: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});

const Complent = mongoose.model("Complent", complentSchema);

export { Complent };