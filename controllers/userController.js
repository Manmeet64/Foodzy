import multer from "multer";
import userModel from "../models/userModel.js"; // Replace with your actual User model

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Multer upload middleware
const uploadMiddleware = upload.single("profilePicture"); // "profilePicture" matches the FormData key

// Endpoint Controller
const updateProfilePicture = async (req, res) => {
    try {
        const firebaseId = req.firebaseId;
        console.log("Inside multer function:", req.body);

        // Validate request
        if (!firebaseId) {
            return res.status(400).json({ message: "Firebase ID is required" });
        }

        // Check if a file was uploaded
        if (!req.file) {
            return res
                .status(400)
                .json({ message: "Profile picture is required" });
        }

        // Convert file to a Base64 string
        const base64Image = req.file.buffer.toString("base64");
        const mimeType = req.file.mimetype;

        // Find the user by firebaseId
        const user = await userModel.findOne({ firebaseId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user's profilePicture
        user.profilePicture = `data:${mimeType};base64,${base64Image}`;
        await user.save();

        res.status(200).json({
            message: "Profile picture updated successfully",
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        console.error("Error updating profile picture:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { uploadMiddleware, updateProfilePicture };
