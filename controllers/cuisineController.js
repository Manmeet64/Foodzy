import cuisineModel from "../models/cuisineModel.js";
import restaurantModel from "../models/restaurantModel.js";

// Add a cuisine to a restaurant
export const addCuisine = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        let cuisine = req.body;
        cuisine.restaurantId = restaurantId;
        console.log(cuisine);

        // Validate if the restaurant exists
        const restaurant = await restaurantModel.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found",
            });
        }

        let createdCuisine = await cuisineModel.create(cuisine);

        res.status(201).json({
            success: true,
            message: "Cuisine added successfully",
            cuisine: createdCuisine,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error adding cuisine",
            error: error.message,
        });
    }
};

// Get cuisines by restaurantId
export const getCuisinesByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        const cuisines = await cuisineModel.find({ restaurantId });
        if (cuisines.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No cuisines found for this restaurant",
            });
        }

        res.status(200).json({
            success: true,
            cuisines,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching cuisines",
            error: error.message,
        });
    }
};

// Get a specific cuisine by cuisineId and restaurantId
export const getCuisineById = async (req, res) => {
    try {
        const { restaurantId, cuisineId } = req.params;

        const cuisine = await cuisineModel.findOne({
            restaurantId,
            _id: cuisineId,
        });
        if (!cuisine) {
            return res.status(404).json({
                success: false,
                message: "Cuisine not found",
            });
        }

        res.status(200).json({
            success: true,
            cuisine,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching cuisine",
            error: error.message,
        });
    }
};

// Update a specific cuisine by cuisineId and restaurantId
export const updateCuisine = async (req, res) => {
    try {
        const { restaurantId, cuisineId } = req.params;
        const { name, description, subcategories, imageUrl } = req.body;

        // Find the cuisine by restaurantId and cuisineId and update it
        const cuisine = await cuisineModel.findOneAndUpdate(
            { restaurantId, _id: cuisineId },
            { $set: { name, description, subcategories, imageUrl } },
            { new: true }
        );

        if (!cuisine) {
            return res.status(404).json({
                success: false,
                message: "Cuisine not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Cuisine updated successfully",
            cuisine,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating cuisine",
            error: error.message,
        });
    }
};

// Delete a specific cuisine by cuisineId and restaurantId
export const deleteCuisine = async (req, res) => {
    try {
        const { restaurantId, cuisineId } = req.params;

        const cuisine = await cuisineModel.findOneAndDelete({
            restaurantId,
            _id: cuisineId,
        });

        if (!cuisine) {
            return res.status(404).json({
                success: false,
                message: "Cuisine not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Cuisine deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting cuisine",
            error: error.message,
        });
    }
};

// Add a subcategory to a specific cuisine
export const addSubcategoryToCuisine = async (req, res) => {
    try {
        const { restaurantId, cuisineId } = req.params;
        const { subcategory } = req.body;

        const cuisine = await cuisineModel.findOne({
            restaurantId,
            _id: cuisineId,
        });

        if (!cuisine) {
            return res.status(404).json({
                success: false,
                message: "Cuisine not found",
            });
        }

        cuisine.subcategories.push(subcategory);
        await cuisine.save();

        res.status(200).json({
            success: true,
            message: "Subcategory added successfully",
            cuisine,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error adding subcategory to cuisine",
            error: error.message,
        });
    }
};
