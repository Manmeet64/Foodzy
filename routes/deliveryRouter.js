import express from "express";
import { createDeliveryAgent } from "../controllers/deliveryController.js";

const router = express.Router();
router.post("/", createDeliveryAgent);
export default router;
