import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        orderId: { type: String, required: true, unique: true },
        userId: { type: String, required: true }, // Reference to the user
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "restauarants",
            required: true,
        },
        items: [
            {
                dishId: {
                    type: String,
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                cuisine: { type: String, required: true }, // Cuisine type (from Menu schema)
                imageUrl: { type: String, required: true },
            },
        ],
        totalAmount: { type: Number, required: true },
        orderDate: { type: Date, default: Date.now },
        scheduledTime: { type: Date }, // New field for scheduled orders
        status: {
            type: String,
            required: true,
            enum: [
                "pending",
                "confirmed",
                "preparing",
                "completed",
                "cancelled",
            ],
            default: "Pending",
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Create the model
const orderModel = mongoose.model("orders", OrderSchema);

export default orderModel;
