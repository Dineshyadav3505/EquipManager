import mongoose, {Schema} from "mongoose";

const ServiceSchema = new Schema({
    message: {
        type: String,
        lowercase: true,
        required: true,
    },
    cost:{
        type: Number,
        required: true,
    },
    product:{
        type: Schema.Types.ObjectId,
        ref: "Product",
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});