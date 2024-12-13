import orderModel from "../models/orderModel.js"; // Order Model
import { v4 as uuidv4 } from "uuid"; // To generate unique order IDs

export const createOrder = async (req, res) => {
    try {
        let order = req.body;

        // Generate a unique order ID
        const orderId = uuidv4();
        order.orderId = orderId;

        // Calculate total amount (optional, in case frontend sends pre-calculated amount)
        let calculatedTotalAmount = totalAmount;
        if (!calculatedTotalAmount) {
            calculatedTotalAmount = items.reduce(
                (total, item) => total + item.quantity * item.price,
                0
            );
        }

        let newOrder = await orderModel.create(order);

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: newOrder,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error creating order",
            error: error.message,
        });
    }
};
// Get all orders by a specific user
export const getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find all orders for the user
        const orders = await orderModel.find({ userId });

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found for this user",
            });
        }

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: error.message,
        });
    }
};
// Get a specific order by its orderId
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find the order by orderId
        const order = await orderModel.findOne({ orderId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching order",
            error: error.message,
        });
    }
};
// Update order status (e.g., Cancel or Complete)
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body; // Status could be "Cancelled", "Completed", etc.

        // Find the order and update its status
        const updatedOrder = await orderModel.findOneAndUpdate(
            { orderId },
            { $set: { status } },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            order: updatedOrder,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating order status",
            error: error.message,
        });
    }
};
// Cancel an order
export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find and cancel the order
        const cancelledOrder = await orderModel.findOneAndUpdate(
            { orderId },
            { $set: { status: "Cancelled" } },
            { new: true }
        );

        if (!cancelledOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error cancelling order",
            error: error.message,
        });
    }
};
