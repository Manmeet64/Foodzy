import mongoose from "mongoose";

// Cuisine Schema
const cuisineSchema = mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "restaurants",
        required: true,
    },
    cuisines: [String],
});

const cuisineModel = mongoose.model("cuisines", cuisineSchema);

export default cuisineModel;
