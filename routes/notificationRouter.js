import sendNotification from "../controllers/notificationController.js";
import express from "express";

const router = express.Router();
router.post("/send-notification", sendNotification);
export default router;
