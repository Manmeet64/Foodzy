import mongoose from "mongoose";
const menuSchema = mongoose.Schema({
    menuId: {
        type: String,
        required: true,
        unique: true,
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "restaurants",
        required: true,
    },
    dishes: [
        {
            dishId: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            description: {
                type: String,
            },
            price: {
                type: Number,
                required: true,
            },
            imageUrl: {
                type: String,
            },
            cuisine: {
                type: String, // E.g., "Indian", "Italian"
                required: true,
            },
            moodTags: {
                type: [String],
                required: true,
            },
            ratings: {
                average: {
                    type: Number,
                    default: 0,
                },
                count: {
                    type: Number,
                    default: 0,
                },
            },
        },
    ],
});

const menuModel = mongoose.model("menus", menuSchema);

export default menuModel;
