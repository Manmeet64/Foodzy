import mongoose from "mongoose";
import restaurantModel from "../../models/restaurantModel.js";
import cuisineModel from "../../models/cuisineModel.js";
import menuModel from "../../models/menuModel.js";
import reviewModel from "../../models/reviewModel.js";

const restaurantResolvers = {
    Query: {
        getRestaurantById: async (_, { id }) => {
            try {
                const objectId = new mongoose.Types.ObjectId(id);

                // Fetch the restaurant
                const restaurant = await restaurantModel.findOne({
                    _id: objectId,
                });
                if (!restaurant) throw new Error("Restaurant not found");

                // Fetch cuisines
                const cuisines = await cuisineModel.find({
                    restaurantId: objectId,
                });

                // Fetch reviews
                const reviews = await reviewModel.find({
                    restaurantId: objectId,
                });

                // Fetch menu and ensure all required fields are present
                const menu = await menuModel
                    .findOne({ restaurantId: objectId })
                    .lean();
                const validDishes =
                    menu?.dishes?.map((dish) => ({
                        ...dish,
                        name: dish.name || "Unnamed Dish", // Provide a fallback for name
                    })) || [];

                return {
                    ...restaurant.toObject(),
                    cuisines,
                    reviews,
                    menu: validDishes,
                };
            } catch (error) {
                console.error("Error fetching restaurant:", error);
                throw new Error("Error fetching restaurant");
            }
        },
    },
};

export default restaurantResolvers;
