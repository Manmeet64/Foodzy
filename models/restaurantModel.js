import mongoose from "mongoose";

const restaurantSchema = mongoose.Schema({
    adminId: {
        type: String,
        required: true,
    },
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
        locality: String,
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
        },
    ],
});

const restaurantModel = mongoose.model("Restaurant", restaurantSchema);

export default restaurantModel;
