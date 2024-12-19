import express from "express";
import {
    createDeliveryAgent,
    getClosestDeliveryAgent,
} from "../controllers/deliveryController.js";

const router = express.Router();
router.post("/", createDeliveryAgent);
router.get("/:restaurantId", getClosestDeliveryAgent);
export default router;
