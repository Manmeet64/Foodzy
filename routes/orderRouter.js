import express from "express";
import {
    createOrder,
    getOrdersByUser,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
} from "../controllers/orderController.js"; // Importing controller functions

const router = express.Router();

// Route for creating an order
router.post("/", createOrder);

// Route for getting orders by user
router.get("/user/:userId", getOrdersByUser);

// Route for getting a specific order by orderId
router.get("/:orderId", getOrderById);

// Route for updating the order status (e.g., Cancel or Complete)
router.put("/:orderId/status", updateOrderStatus);

// Route for cancelling an order
router.put("/:orderId/cancel", cancelOrder);

export default router;
