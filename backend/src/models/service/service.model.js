import mongoose, {Schema} from "mongoose";

const ServiceSchema = new Schema({
    message: {
        type: String,
        lowercase: true,
        required: true,
    },
    cost:{
        type: Number,
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

const Service = mongoose.model("Service", ServiceSchema);

export { Service };