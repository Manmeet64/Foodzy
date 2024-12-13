import mongoose from "mongoose";

const restaurantSchema = mongoose.Schema({
    restaurantId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
    },
    contact: {
        phone: String,
        email: String,
    },
    hours: {
        day: String,
        open: String,
        close: String,
    },
    estimatedDeliveryTime: String,
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
    photos: [
        {
            photoId: String,
            url: String,
            description: String,
        },
    ],
    features: {
        delivery: Boolean,
        takeout: Boolean,
        reservations: Boolean,
        parking: String,
    },
    status: {
        type: String,
        enum: ["Open", "Closed", "Temporarily Closed"],
        default: "Open",
    },
});

const restaurantModel = mongoose.model("Restaurant", restaurantSchema);

export default restaurantModel;
