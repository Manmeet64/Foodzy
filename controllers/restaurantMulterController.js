import multer from "multer";
import restaurantModel from "../models/restaurantModel.js"; // Replace with your actual Restaurant model
import { v4 as uuidv4 } from "uuid";

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Multer upload middleware
const uploadMiddleware = upload.array("photos", 3); // "photos" matches the FormData key, limit to 3 files

// Endpoint Controller
const updateRestaurantPhotos = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        console.log("Received Restaurant ID:", restaurantId);
        console.log("Uploaded Files:", req.files);

        // Validate request
        if (!restaurantId) {
            return res
                .status(400)
                .json({ message: "Restaurant ID is required" });
        }

        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res
                .status(400)
                .json({ message: "At least one photo is required" });
        }

        // Generate photo objects from uploaded files
        const photos = req.files.map((file) => ({
            photoId: uuidv4(),
            url: `data:${file.mimetype};base64,${file.buffer.toString(
                "base64"
            )}`,
            description: req.body.descriptions || "No description provided", // Optional description
        }));

        // Find the restaurant by restaurantId
        const restaurant = await restaurantModel.findOne({ _id: restaurantId }); // Use _id if MongoDB ObjectID is used
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // Update the restaurant's photos array
        restaurant.photos.push(...photos);
        await restaurant.save();

        res.status(200).json({
            message: "Photos uploaded successfully",
            photos: restaurant.photos,
        });
    } catch (error) {
        console.error("Error updating restaurant photos:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { uploadMiddleware, updateRestaurantPhotos };
