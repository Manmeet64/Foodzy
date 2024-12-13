import mongoose from "mongoose";

export default async function connectDB() {
    try {
        await mongoose.connect("mongodb://localhost:27017/Foodzy");
        console.log("Database connected");
    } catch (err) {
        console.log(err);
    }
}
