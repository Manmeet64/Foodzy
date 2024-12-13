import mongoose from "mongoose";

const groupOrderSchema = new mongoose.Schema(
    {
        groupId: { type: String, required: true, unique: true },
        ownerId: { type: String, required: true }, // ID of the user who created the order
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "restaurants",
            required: true,
        }, // Links the group order to a specific restaurant
        orderItems: [
            {
                dishId: { type: String, required: true }, // References the dishId from the menu
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                addedBy: { type: String, required: true }, // User who added the dish
            },
        ],
        members: [
            {
                userId: { type: String, required: true },
                status: {
                    type: String,
                    enum: ["joined", "left"],
                    default: "joined",
                },
                paymentStatus: {
                    type: String,
                    enum: ["pending", "paid"],
                    default: "pending",
                },
            },
        ],
        totalAmount: { type: Number, default: 0 },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid"],
            default: "pending",
        },
        deliveryStatus: {
            type: String,
            enum: ["Preparing", "On the way", "Delivered"],
            default: "Preparing",
        },
    },
    { timestamps: true }
);

groupOrderSchema.pre("save", function (next) {
    this.totalAmount = this.orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    next();
});

const groupOrderModel = mongoose.model("groupOrders", groupOrderSchema);

export default groupOrderModel;
