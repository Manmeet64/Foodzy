import multer from "multer";
import menuModel from "../models/menuModel.js"; // Import your menu model

// Multer storage configuration for FormData
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Multer upload middleware to handle 3 image URLs
const uploadMiddleware = upload.fields([
    { name: "imageUrl1", maxCount: 1 },
    { name: "imageUrl2", maxCount: 1 },
    { name: "imageUrl3", maxCount: 1 },
]);

// Controller function to update menu with image URLs
const updateDishImages = async (req, res) => {
    try {
        const { restaurantId, menuId } = req.params;
        const { imageUrl1, imageUrl2, imageUrl3 } = req.files; // Get image URLs from the FormData

        // Check if we have all three images
        if (!imageUrl1 || !imageUrl2 || !imageUrl3) {
            return res
                .status(400)
                .json({ message: "All 3 image URLs are required" });
        }

        // Fetch the menu document for the given restaurant and menuId
        const menu = await menuModel.findOne({ restaurantId, menuId });
        if (!menu) {
            return res
                .status(404)
                .json({ message: "Menu not found for the given restaurant" });
        }

        // Ensure the number of dishes is at least 3 to apply image URLs
        if (menu.dishes.length < 3) {
            return res
                .status(400)
                .json({ message: "Menu must have at least 3 dishes" });
        }

        // Add the image URLs to the dishes array sequentially
        menu.dishes[0].imageUrl = imageUrl1[0].path; // Add image to first dish
        menu.dishes[1].imageUrl = imageUrl2[0].path; // Add image to second dish
        menu.dishes[2].imageUrl = imageUrl3[0].path; // Add image to third dish

        // Save the updated menu document
        await menu.save();

        return res
            .status(200)
            .json({ message: "Dish images updated successfully", menu });
    } catch (error) {
        console.error("Error updating dish images:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { uploadMiddleware, updateDishImages };
