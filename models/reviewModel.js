import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
    reviewId: {
        type: String,
        required: true,
        unique: true,
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "restaurants",
        required: true,
    },
    userId: {
        type: String, // Can link to a User model if available
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const reviewModel = mongoose.model("reviews", reviewSchema);

export default reviewModel;
