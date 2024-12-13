import { v4 as uuidv4 } from "uuid";
import reviewModel from "../models/reviewModel.js";
import restaurantModel from "../models/restaurantModel.js";

// Create a new review
export const createReview = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        let review = req.body;

        // Validate restaurant existence using findById
        const restaurant = await restaurantModel.findById(restaurantId); // Use findById for ObjectId lookup
        if (!restaurant) {
            return res.status(404).send({
                success: false,
                message: "Restaurant not found",
            });
        }

        // Generate unique reviewId
        const reviewId = uuidv4();
        review.reviewId = reviewId;
        review.restaurantId = restaurantId; // Ensure that the review is associated with the correct restaurant

        // Save the review to the database
        const newReview = await reviewModel.create(review);

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            review: newReview,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error creating review",
            error: error.message,
        });
    }
};

// Get all reviews for a specific restaurant
export const getReviewsByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // Find all reviews for the given restaurant using findById to get the ObjectId of the restaurant
        const reviews = await reviewModel.find({ restaurantId }); // This assumes restaurantId is still an ObjectId in the review model

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No reviews found for this restaurant",
            });
        }

        res.status(200).json({
            success: true,
            reviews,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching reviews",
            error: error.message,
        });
    }
};

// Get a specific review by its reviewId
export const getReviewById = async (req, res) => {
    try {
        const { restaurantId, reviewId } = req.params;

        // Find the review for the specific restaurant by reviewId using findById
        const review = await reviewModel.findOne({ restaurantId, reviewId });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        res.status(200).json({
            success: true,
            review,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching review",
            error: error.message,
        });
    }
};

// Update an existing review by reviewId
export const updateReview = async (req, res) => {
    try {
        const { restaurantId, reviewId } = req.params;
        const { rating, comment } = req.body;

        // Find and update the review using findOneAndUpdate
        const updatedReview = await reviewModel.findOneAndUpdate(
            { restaurantId, reviewId },
            { $set: { rating, comment } },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            review: updatedReview,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating review",
            error: error.message,
        });
    }
};

// Delete a review by reviewId
export const deleteReview = async (req, res) => {
    try {
        const { restaurantId, reviewId } = req.params;

        // Find and delete the review using findOneAndDelete
        const deletedReview = await reviewModel.findOneAndDelete({
            restaurantId,
            reviewId,
        });

        if (!deletedReview) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting review",
            error: error.message,
        });
    }
};
