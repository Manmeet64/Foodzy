import express from "express";
import {
    createReview,
    getReviewsByRestaurant,
    getReviewById,
    updateReview,
    deleteReview,
} from "../controllers/reviewController.js"; // Import controller functions

const router = express.Router();

// Route to create a new review
router.post("/:restaurantId", createReview);

// Route to get all reviews for a specific restaurant
router.get("/:restaurantId", getReviewsByRestaurant);

// Route to get a specific review by reviewId
router.get("/:restaurantId/:reviewId", getReviewById);

// Route to update an existing review
router.put("/:restaurantId/:reviewId", updateReview);

// Route to delete a review
router.delete("/:restaurantId/:reviewId", deleteReview);

export default router;
