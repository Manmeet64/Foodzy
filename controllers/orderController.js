import { v4 as uuidv4 } from "uuid";
import orderModel from "../models/orderModel.js";
export const createOrUpdateOrder = async (req, res) => {
    try {
        const { restaurantId, dish } = req.body; // Extract restaurantId and dish
        const userId = req.firebaseId; // Extract userId from Firebase token
        console.log(dish);
        if (!dish || !restaurantId) {
            return res.status(400).json({
                success: false,
                message: "Dish and restaurantId are required",
            });
        }

        // Generate a unique orderId for the new order
        const orderId = uuidv4();

        // Check if there's an existing order for the restaurant with pending status
        const existingOrder = await orderModel.findOne({
            restaurantId,
            userId,
            status: "pending",
        });

        if (existingOrder) {
            // Check if the dish already exists in the order
            const existingDishIndex = existingOrder.items.findIndex(
                (item) => item.dishId === dish.dishId
            );

            if (existingDishIndex > -1) {
                // Increment the quantity of the existing dish
                existingOrder.items[existingDishIndex].quantity +=
                    dish.quantity;
            } else {
                // Add the new dish to the items array
                existingOrder.items.push(dish);
            }

            // Recalculate the total amount
            existingOrder.totalAmount = existingOrder.items.reduce(
                (total, item) => total + item.quantity * item.price,
                0
            );

            // Save the updated order
            const updatedOrder = await existingOrder.save();

            return res.status(200).json({
                success: true,
                message: "Order updated successfully",
                order: updatedOrder,
            });
        } else {
            // Create a new order if no pending order exists
            const newOrder = await orderModel.create({
                orderId, // Assign the generated orderId
                restaurantId,
                userId,
                items: [dish], // Add the dish to the items array
                totalAmount: dish.quantity * dish.price,
                status: "pending", // Ensure the status is 'pending'
            });

            return res.status(201).json({
                success: true,
                message: "Order created successfully",
                order: newOrder,
            });
        }
    } catch (error) {
        console.error("Error creating or updating order:", error);
        res.status(500).json({
            success: false,
            message: "Error creating or updating order",
            error: error.message,
        });
    }
};

export const deleteOrUpdateOrder = async (req, res) => {
    try {
        const { restaurantId, dish } = req.body; // Extract restaurantId and dish
        const userId = req.firebaseId; // Extract userId from Firebase token

        if (!dish || !restaurantId) {
            return res.status(400).json({
                success: false,
                message: "Dish and restaurantId are required",
            });
        }

        // Check if there's an existing order for the restaurant with pending status
        const existingOrder = await orderModel.findOne({
            restaurantId,
            userId,
            status: "pending",
        });

        if (existingOrder) {
            // Check if the dish exists in the order
            const existingDishIndex = existingOrder.items.findIndex(
                (item) => item.dishId === dish.dishId
            );

            if (existingDishIndex > -1) {
                // Decrement the quantity of the existing dish
                existingOrder.items[existingDishIndex].quantity -=
                    dish.quantity;

                // If the quantity becomes zero, remove the dish from the items array
                if (existingOrder.items[existingDishIndex].quantity <= 0) {
                    existingOrder.items.splice(existingDishIndex, 1);
                }
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Dish not found in the order",
                });
            }

            // If no items are left, delete the order
            if (existingOrder.items.length === 0) {
                await orderModel.findByIdAndDelete(existingOrder._id);

                return res.status(200).json({
                    success: true,
                    message: "Order deleted successfully",
                });
            }

            // Recalculate the total amount
            existingOrder.totalAmount = existingOrder.items.reduce(
                (total, item) => total + item.quantity * item.price,
                0
            );

            // Save the updated order
            const updatedOrder = await existingOrder.save();

            return res.status(200).json({
                success: true,
                message: "Order updated successfully",
                order: updatedOrder,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No pending order found for the restaurant",
            });
        }
    } catch (error) {
        console.error("Error deleting or updating order:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting or updating order",
            error: error.message,
        });
    }
};

export const getPendingOrders = async (req, res) => {
    try {
        const userId = req.firebaseId; // Get the userId from the Firebase token

        // Fetch orders with status "pending" for the user
        const pendingOrders = await orderModel.find({
            userId,
            status: "pending",
        });

        // If no orders are found
        if (pendingOrders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No pending orders found for this user",
            });
        }

        // Return the found orders
        return res.status(200).json({
            success: true,
            message: "Pending orders retrieved successfully",
            orders: pendingOrders,
        });
    } catch (error) {
        console.error("Error fetching pending orders:", error);

        // Handle any error that occurs during the fetch
        return res.status(500).json({
            success: false,
            message: "Error fetching pending orders",
            error: error.message,
        });
    }
};
import restaurantModel from "../models/restaurantModel.js";

export const getPendingOrdersWithRestaurantNames = async (req, res) => {
    try {
        const userId = req.firebaseId; // Get the userId from the Firebase token

        // Fetch all pending orders for the user
        const pendingOrders = await orderModel.find({
            userId,
            status: "pending",
        });

        // If no pending orders are found
        if (pendingOrders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No pending orders found for this user",
            });
        }

        // Fetch restaurant names corresponding to the pending orders' restaurantIds
        const ordersWithRestaurantNames = await Promise.all(
            pendingOrders.map(async (order) => {
                // Fetch the restaurant name using the restaurantId
                const restaurant = await restaurantModel.findById(
                    order.restaurantId
                );

                // If the restaurant is not found, set a default name
                const restaurantName = restaurant
                    ? restaurant.name
                    : "Unknown Restaurant";
                const restaurantImage = restaurant
                    ? restaurant.photos[0].url
                    : "No Photo Present";
                return {
                    ...order.toObject(), // Convert order to plain object
                    restaurantName,
                    restaurantImage, // Add restaurant name to the order object
                };
            })
        );

        // Return the orders with their restaurant names
        return res.status(200).json({
            success: true,
            message:
                "Pending orders with restaurant names retrieved successfully",
            orders: ordersWithRestaurantNames,
        });
    } catch (error) {
        console.error(
            "Error fetching pending orders with restaurant names:",
            error
        );

        // Handle any error that occurs during the fetch
        return res.status(500).json({
            success: false,
            message: "Error fetching pending orders with restaurant names",
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

export const deleteOrder = async (req, res) => {
    try {
        // Extract restaurantId from the request body
        const { restaurantId } = req.body;
        const firebaseId = req.firebaseId;

        // Find and delete the order with the given restaurantId, userId, and pending status
        const deletedOrder = await orderModel.findOneAndDelete({
            restaurantId,
            userId: firebaseId,
            status: "pending",
        });

        // If no matching order is found, return an error message
        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: "No pending order found for this restaurant.",
            });
        }

        // If the order is successfully deleted, return a success message
        return res.status(200).json({
            success: true,
            message: "Order deleted successfully.",
            deletedOrder,
        });
    } catch (error) {
        console.error("Error deleting order:", error);

        // Handle errors gracefully
        res.status(500).json({
            success: false,
            message: "Error deleting order.",
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

// Function to get the pending order of a user for a specific restaurant
export const getPendingOrderByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params; // Get restaurantId from the URL parameters
        const userId = req.firebaseId; // Get the logged-in user's Firebase ID from the middleware or request

        if (!restaurantId) {
            return res.status(400).json({
                success: false,
                message: "Restaurant ID is required",
            });
        }

        // Fetch the pending order for the user and restaurant
        const order = await orderModel.findOne({
            restaurantId,
            userId,
            status: "pending", // Only get the pending orders
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "No pending order found for this restaurant",
            });
        }

        return res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Error fetching pending order:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching pending order",
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

import Stripe from "stripe";

const stripe = new Stripe("sk_test_tR3PYbcVNZZ796tH88S4VQ2u"); // Replace with your Stripe secret key

import userModel from "../models/userModel.js";

export const createCheckoutSession = async (req, res) => {
    const { orderId } = req.params;
    const items = req.body.items;
    const deliveryCharge = req.body.deliveryCharge;
    const restaurantId = req.body.restaurantId;

    try {
        // Fetch the user details from the database using the firebaseId from the request
        const user = await userModel.findOne({ firebaseId: req.firebaseId });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Extract user details
        const customerName = `${user.name.firstName} ${user.name.lastName}`;
        const customerEmail = user.email;
        const customerAddress = user.address[0]; // Assuming the user has only one address

        // Map order items to Stripe's line_items format
        const lineItems = items.map((item) => {
            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name,
                        images: [item.imageUrl], // Stripe expects an array of image URLs
                    },
                    unit_amount: item.price * 100, // Convert price to paise
                },
                quantity: item.quantity,
            };
        });

        // Add delivery charge as a separate line item
        if (deliveryCharge) {
            lineItems.push({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: "Delivery Charge",
                    },
                    unit_amount: deliveryCharge * 100, // Convert charge to paise
                },
                quantity: 1,
            });
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${req.headers.origin}/track/${restaurantId}/${orderId}`,
            cancel_url: `${req.headers.origin}/cart`,
            shipping_address_collection: {
                allowed_countries: ["IN"], // Only allow Indian addresses for export transactions
            },
            customer_email: customerEmail, // Pass customer's email
        });

        // Send session ID to the client
        res.status(200).json({ id: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Failed to create checkout session" });
    }
};

export const confirmOrder = async (req, res) => {
    const { orderId } = req.params; // Extract orderId from params

    try {
        // Find the order by the orderId field
        const order = await orderModel.findOne({ orderId: orderId });

        if (!order) {
            // If the order is not found, return a 404 error
            return res.status(404).json({ error: "Order not found" });
        }

        // Update the status of the order to 'confirmed'
        order.status = "confirmed"; // Assuming you have a 'status' field in your order model

        // Save the updated order
        await order.save();

        // Send a success response with the updated order
        res.status(200).json({
            message: "Order confirmed successfully",
            order,
        });
    } catch (error) {
        console.error("Error confirming order:", error);
        res.status(500).json({ error: "Failed to confirm order" });
    }
};

export const changeStatusOrder = async (req, res) => {
    const { orderId } = req.params; // Extract orderId from params
    const { status } = req.body;

    try {
        // Find the order by the orderId field
        const order = await orderModel.findOne({ orderId: orderId });

        if (!order) {
            // If the order is not found, return a 404 error
            return res.status(404).json({ error: "Order not found" });
        }

        // Update the status of the order to 'confirmed'
        order.status = status; // Assuming you have a 'status' field in your order model

        // Save the updated order
        await order.save();

        // Send a success response with the updated order
        res.status(200).json({
            message: "Order confirmed successfully",
            order,
        });
    } catch (error) {
        console.error("Error confirming order:", error);
        res.status(500).json({ error: "Failed to confirm order" });
    }
};
