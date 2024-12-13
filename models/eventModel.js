import mongoose from "mongoose";

const eventSchema = mongoose.Schema(
    {
        eventId: { type: String, required: true, unique: true },
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "restaurants",
            required: true,
        }, // Reference to the restaurant hosting the event
        name: { type: String, required: true },
        description: { type: String, required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        status: {
            type: String,
            enum: ["upcoming", "active", "completed", "cancelled"],
            default: "upcoming",
        },
        image: { type: String }, // URL for event image, optional
        attendees: [
            {
                userId: { type: String, required: true }, // Reference to the user
                rsvpAt: { type: Date, default: Date.now }, // RSVP timestamp
            },
        ],
    },
    { timestamps: true }
);

const eventModel = mongoose.model("events", eventSchema);

export default eventModel;
