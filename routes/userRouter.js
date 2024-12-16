import express from "express";
import {
    uploadMiddleware,
    updateProfilePicture,
} from "../controllers/userController.js";

const router = express.Router();

// Endpoint to handle profile picture update
router.put("/profile-picture", uploadMiddleware, updateProfilePicture);

export default router;
