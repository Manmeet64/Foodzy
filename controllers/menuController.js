import { v4 as uuidv4 } from "uuid"; // Import uuid to generate unique ids
import menuModel from "../models/menuModel.js"; // Import the menu model
import restaurantModel from "../models/restaurantModel.js"; // Import the restaurant model to validate restaurant existence

//This is mood key mapping
const moodKeywordMapping = {
    happy: [
        "chocolate",
        "cake",
        "burger",
        "pizza",
        "ice cream",
        "fries",
        "donut",
    ],
    sad: ["soup", "macaroni", "cheese", "stew", "broth", "comfort"],
    angry: ["spicy", "curry", "chili", "wings", "hot", "pepper"],
    romantic: ["steak", "pasta", "wine", "chocolate", "dessert", "fondue"],
    anxious: ["tea", "herbal", "salad", "smoothie", "oats"],
    depressed: ["comfort", "indulgent", "fried", "dessert", "cake"],
    excited: ["sushi", "fresh", "wrap", "fruit", "taco", "energetic"],
    nostalgic: ["traditional", "homemade", "classic", "authentic", "grandma"],
    energetic: ["protein", "bar", "bowl", "shake", "nuts"],
    cozy: ["warm", "hot chocolate", "soup", "latte", "stew"],
};

// This is the function to assign moodtags to a dish
const assignMoodTags = (dishName, dishDescription) => {
    const tags = new Set(); // Use a Set to avoid duplicate tags

    // Combine name and description for keyword matching
    const text = `${dishName.toLowerCase()} ${
        dishDescription?.toLowerCase() || ""
    }`;

    // Match keywords to moods
    Object.entries(moodKeywordMapping).forEach(([mood, keywords]) => {
        if (keywords.some((keyword) => text.includes(keyword))) {
            tags.add(mood);
        }
    });

    return Array.from(tags); // Convert Set to Array
};

export const addMenu = async (req, res) => {
    try {
        // Extract restaurantId and dishes from the request body
        const { dishes } = req.body;
        const { restaurantId } = req.params;

        // Validate if the restaurant exists using findOne for restaurantId
        const restaurant = await restaurantModel.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found",
            });
        }

        // Generate a unique menuId (you can generate this ID if necessary, or use other ways to make it unique)
        const menuId = uuidv4();

        // Generate random unique dishId for each dish in the dishes array
        const dishesWithIds = dishes.map((dish) => ({
            ...dish,
            dishId: uuidv4(), // Assign a unique dishId to each dish
        }));

        // Create the menu object
        const menu = {
            menuId,
            restaurantId,
            dishes: dishesWithIds,
        };

        // Create and save the menu
        const newMenu = await menuModel.create(menu);

        res.status(201).json({
            success: true,
            message: "Menu created successfully",
            menu: newMenu,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error creating menu",
            error: error.message,
        });
    }
};

export const getMenuByRestaurantId = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // Find the menu by restaurantId using findOne
        const menu = await menuModel.findOne({ restaurantId });
        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menu not found for this restaurant",
            });
        }

        res.status(200).json({
            success: true,
            menu: menu,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching menu",
            error: error.message,
        });
    }
};

export const getDishById = async (req, res) => {
    try {
        const { restaurantId, dishId } = req.params;

        // Find the menu for the restaurant using findOne
        const menu = await menuModel.findOne({ restaurantId });
        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menu not found for this restaurant",
            });
        }

        // Find the specific dish in the menu by dishId
        const dish = menu.dishes.find((d) => d.dishId === dishId);
        if (!dish) {
            return res.status(404).json({
                success: false,
                message: "Dish not found",
            });
        }

        res.status(200).json({
            success: true,
            dish: dish,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching dish",
            error: error.message,
        });
    }
};

// Add dish to a particular restaurant
export const addDish = async (req, res) => {
    try {
        const { restaurantId, dish } = req.body;

        // Validate the restaurant exists using findOne for restaurantId
        const restaurant = await restaurantModel.findOne({ restaurantId });
        if (!restaurant) {
            return res
                .status(404)
                .json({ success: false, message: "Restaurant not found" });
        }

        // Assign mood tags based on dish name and description
        const moodTags = assignMoodTags(dish.name, dish.description);
        dish.moodTags = moodTags;

        // Add the dish to the restaurant's menu
        const updatedMenu = await menuModel.findOneAndUpdate(
            { restaurantId },
            { $push: { dishes: { ...dish, dishId: uuidv4() } } },
            { new: true }
        );

        res.status(201).json({
            success: true,
            message: "Dish added successfully",
            menu: updatedMenu,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error adding dish",
            error: error.message,
        });
    }
};

export const updateDish = async (req, res) => {
    try {
        const { restaurantId, dishId } = req.params;
        const updatedDishDetails = req.body;

        // Find and update the dish in the menu directly using findOneAndUpdate
        const menu = await menuModel.findOneAndUpdate(
            { restaurantId, "dishes.dishId": dishId },
            { $set: { "dishes.$": updatedDishDetails } }, // Use $set to update the specific dish
            { new: true } // Return the updated menu document
        );

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Dish not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Dish updated successfully",
            dish: updatedDishDetails, // You can return the updated dish directly
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating dish",
            error: error.message,
        });
    }
};

export const deleteDish = async (req, res) => {
    try {
        const { restaurantId, dishId } = req.params;

        // Find the menu for the restaurant and remove the specific dish from the dishes array
        const menu = await menuModel.findOneAndUpdate(
            { restaurantId, "dishes.dishId": dishId }, // Find the restaurant's menu with the specific dishId
            { $pull: { dishes: { dishId: dishId } } }, // Use $pull to remove the dish from the dishes array
            { new: true } // Return the updated menu document
        );

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menu or dish not found for this restaurant",
            });
        }

        res.status(200).json({
            success: true,
            message: "Dish deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting dish",
            error: error.message,
        });
    }
};

// This function will fetch all dishes associated with a specific mood tag.
export const getDishesByMood = async (req, res) => {
    try {
        const { mood } = req.params; // Mood tag sent from the frontend

        // Find all menus that have dishes with the specified mood tag
        const menus = await menuModel.find({
            "dishes.moodTags": mood,
        });

        // Collect all dishes matching the mood
        const dishes = menus.flatMap((menu) =>
            menu.dishes.filter((dish) => dish.moodTags.includes(mood))
        );

        if (dishes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No dishes found for the given mood",
            });
        }

        res.status(200).json({
            success: true,
            mood: mood,
            dishes: dishes,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching dishes by mood",
            error: error.message,
        });
    }
};
