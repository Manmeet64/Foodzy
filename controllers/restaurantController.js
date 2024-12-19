import restaurantModel from "../models/restaurantModel.js"; // Assuming this is the model path
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import { createSession } from "../graphDb.js";

/**
 * Add a New Restaurant
 */

export const addRestaurant = async (req, res) => {
    try {
        // Generate a unique restaurantId
        const firebaseId = req.firebaseId;
        const restaurantId = uuidv4();
        const restaurantData = req.body;

        // Add restaurantId to the request body
        restaurantData.restaurantId = restaurantId;
        restaurantData.adminId = firebaseId;

        // Extract city from address for Neo4j location property
        const { city } = restaurantData.address;
        if (!city) {
            return res.status(400).json({
                success: false,
                message: "City is required in the address.",
            });
        }

        // Save restaurant in MongoDB
        const restaurant = await restaurantModel.create(restaurantData);

        // Save restaurant in Neo4j
        const session = createSession("WRITE"); // Use write session
        try {
            await session.run(
                `
                CREATE (r:Restaurant {id: $id, name: $name, location: $location})
                `,
                {
                    id: restaurantId,
                    name: restaurantData.name,
                    location: city,
                }
            );
        } finally {
            session.close(); // Ensure session is closed even if an error occurs
        }

        res.status(201).json({
            success: true,
            message: "Restaurant added successfully",
            restaurant,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error adding restaurant",
            error: error.message,
        });
    }
};

/**
 * Get All Restaurants
 */
export const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await restaurantModel.find();
        res.status(200).json({
            success: true,
            restaurants,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching restaurants",
            error: error.message,
        });
    }
};

/**
 * Get a Single Restaurant
 */
export const getRestaurantById = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const restaurant = await restaurantModel.findById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found",
            });
        }

        res.status(200).json({
            success: true,
            restaurant,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching restaurant",
            error: error.message,
        });
    }
};

/**
 * Update Restaurant Details
 */
export const updateRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const updatedData = req.body;

        const updatedRestaurant = await restaurantModel.findOneAndUpdate(
            { restaurantId },
            updatedData,
            { new: true } // Return the updated document
        );

        if (!updatedRestaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Restaurant updated successfully",
            restaurant: updatedRestaurant,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating restaurant",
            error: error.message,
        });
    }
};

/**
 * Delete a Restaurant
 */
export const deleteRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // Delete restaurant from MongoDB
        const deletedRestaurant = await restaurantModel.findOneAndDelete({
            restaurantId,
        });

        if (!deletedRestaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found",
            });
        }

        // Delete restaurant from Neo4j
        const session = createSession("WRITE"); // Use write session
        await session.run(
            `
            MATCH (r:Restaurant {id: $id})
            DELETE r
            `,
            { id: restaurantId }
        );
        session.close(); // Close the session

        res.status(200).json({
            success: true,
            message: "Restaurant deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting restaurant",
            error: error.message,
        });
    }
};
