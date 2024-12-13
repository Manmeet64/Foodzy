import express from "express";
import {
    getCuisinesByRestaurant,
    getCuisineById,
    updateCuisine,
    deleteCuisine,
    addCuisine,
} from "../controllers/cuisineController.js"; // Importing controller functions

const cuisineRouter = express.Router();

// Create a new cuisine for a restaurant
cuisineRouter.post("/:restaurantId", addCuisine);

// Get all cuisines for a specific restaurant
cuisineRouter.get("/:restaurantId", getCuisinesByRestaurant);

// Get a specific cuisine by its ID
cuisineRouter.get("/:restaurantId/:cuisineId", getCuisineById);

// Update an existing cuisine
cuisineRouter.put("/:restaurantId/:cuisineId", updateCuisine);

// Delete a cuisine by its ID
cuisineRouter.delete("/:restaurantId/:cuisineId", deleteCuisine);

export default cuisineRouter;
