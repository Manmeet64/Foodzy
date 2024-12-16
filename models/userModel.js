import mongoose from "mongoose";
const UserSchema = mongoose.Schema(
    {
        firebaseId: { type: String, required: true, unique: true },
        name: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
        },
        email: { type: String },
        phone: { type: String },
        profilePicture: { type: String },
        address: [
            {
                street: { type: String, required: true },
                city: { type: String, required: true },
                state: { type: String, required: true },
                postalCode: { type: String, required: true },
                country: { type: String, required: true },
            },
        ],
        preferences: {
            cuisines: [String], // Reference to Cuisines model
        },
    },
    {
        timestamps: true,
    }
);

const userModel = mongoose.model("users", UserSchema);
export default userModel;
