import mongoose, { mongo } from "mongoose";

// Cuisine Schema
const cuisineSchema = mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "restaurants",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    subcategories: {
        type: [String],
        default: [],
    },
    imageUrl: {
        type: String,
    },
});

const cuisineModel = mongoose.model("cuisines", cuisineSchema);

export default cuisineModel;
