import express from "express";
import {
    addRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
} from "../controllers/restaurantController.js";
import {
    updateRestaurantPhotos,
    uploadMiddleware,
} from "../controllers/restaurantMulterController.js";

const router = express.Router();

// Admin routes for restaurant management
router.post("/restaurants", addRestaurant);
router.get("/restaurants", getAllRestaurants);
router.get("/restaurants/:restaurantId", getRestaurantById);
router.put("/restaurants/:restaurantId", updateRestaurant);
router.delete("/restaurants/:restaurantId", deleteRestaurant);
router.post(
    "/restaurants/photos/:restaurantId",
    uploadMiddleware,
    updateRestaurantPhotos
);

export default router;
