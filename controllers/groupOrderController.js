import groupOrderModel from "../models/groupOrderModel.js";
import menuModel from "../models/menuModel.js";
import { v4 as uuidv4 } from "uuid"; // Import uuid for unique IDs if needed
import restaurantModel from "../models/restaurantModel.js";

// Allows a user to create a new group order
export const createGroupOrder = async (req, res) => {
    try {
        const { ownerId, restaurantId } = req.body;

        // Validate restaurant existence
        const restaurant = await restaurantModel.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found",
            });
        }

        let groupOrder = await groupOrderModel.create({
            groupId: `GO-${Date.now()}`, // Generate a unique group order ID
            ownerId,
            restaurantId,
            orderItems: [],
            members: [
                { userId: ownerId, status: "joined", paymentStatus: "pending" },
            ],
        });

        // Populate restaurantId for the response
        const populatedGroupOrder = await groupOrderModel
            .findById(groupOrder._id)
            .populate("restaurantId");

        res.status(201).json({
            success: true,
            groupOrder: populatedGroupOrder,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error creating group order",
            error: error.message,
        });
    }
};

// Allows a user to join an existing group order
export const joinGroupOrder = async (req, res) => {
    try {
        const { groupId, userId } = req.body;

        const groupOrder = await groupOrderModel.findOne({ groupId });
        if (!groupOrder) {
            return res
                .status(404)
                .json({ success: false, message: "Group order not found" });
        }

        if (groupOrder.members.some((member) => member.userId === userId)) {
            return res.status(400).json({
                success: false,
                message: "User already in the group order",
            });
        }

        groupOrder.members.push({
            userId,
            status: "joined",
            paymentStatus: "pending",
        });
        await groupOrder.save();

        // Populate restaurantId for the response
        const populatedGroupOrder = await groupOrderModel
            .findById(groupOrder._id)
            .populate("restaurantId");

        res.status(200).json({
            success: true,
            message: "Joined group order successfully",
            groupOrder: populatedGroupOrder,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error joining group order",
            error: error.message,
        });
    }
};

// Allows a user to add an item to the shared cart
export const addItemToGroupOrder = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { dishId, quantity, userId } = req.body;

        const groupOrder = await groupOrderModel.findOne({ groupId });
        if (!groupOrder) {
            return res
                .status(404)
                .json({ success: false, message: "Group order not found" });
        }

        // Ensure dishId is valid from the restaurant's menu
        const menu = await menuModel.findOne({
            restaurantId: groupOrder.restaurantId,
        });

        const dish = menu.dishes.find((d) => d.dishId === dishId);
        if (!dish) {
            return res
                .status(404)
                .json({ success: false, message: "Dish not found in menu" });
        }

        groupOrder.orderItems.push({
            dishId: dish.dishId,
            name: dish.name,
            quantity,
            price: dish.price,
            addedBy: userId,
        });

        await groupOrder.save();

        // Populate restaurantId for the response
        const populatedGroupOrder = await groupOrderModel
            .findById(groupOrder._id)
            .populate("restaurantId");

        res.status(200).json({
            success: true,
            message: "Item added to group order",
            groupOrder: populatedGroupOrder,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error adding item to group order",
            error: error.message,
        });
    }
};

// Allows users to view a specific group order and its shared cart
export const getGroupOrder = async (req, res) => {
    try {
        const { groupId } = req.params;

        const groupOrder = await groupOrderModel
            .findOne({ groupId })
            .populate("restaurantId");
        if (!groupOrder) {
            return res
                .status(404)
                .json({ success: false, message: "Group order not found" });
        }

        res.status(200).json({
            success: true,
            groupOrder,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching group order",
            error: error.message,
        });
    }
};

// Allows a user to remove an item they added to the shared cart
export const removeItemFromGroupOrder = async (req, res) => {
    try {
        const { groupId, dishId, userId } = req.body;

        const groupOrder = await groupOrderModel.findOne({ groupId });
        if (!groupOrder) {
            return res
                .status(404)
                .json({ success: false, message: "Group order not found" });
        }

        const initialCount = groupOrder.orderItems.length;
        groupOrder.orderItems = groupOrder.orderItems.filter(
            (item) => !(item.dishId === dishId && item.addedBy === userId)
        );

        if (groupOrder.orderItems.length === initialCount) {
            return res.status(400).json({
                success: false,
                message: "Item not found or not added by user",
            });
        }

        await groupOrder.save();

        // Populate restaurantId for the response
        const populatedGroupOrder = await groupOrderModel
            .findById(groupOrder._id)
            .populate("restaurantId");

        res.status(200).json({
            success: true,
            message: "Item removed from group order",
            groupOrder: populatedGroupOrder,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error removing item from group order",
            error: error.message,
        });
    }
};
