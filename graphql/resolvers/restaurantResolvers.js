import mongoose from "mongoose";
import restaurantModel from "../../models/restaurantModel.js";
import cuisineModel from "../../models/cuisineModel.js";
import reviewModel from "../../models/reviewModel.js";
import menuModel from "../../models/menuModel.js"; // Assuming menu model is imported here

const restaurantResolvers = {
    Query: {
        getRestaurantById: async (_, { id }) => {
            try {
                const objectId = new mongoose.Types.ObjectId(id);

                // Fetch the restaurant by ID
                const restaurant = await restaurantModel.findOne({
                    _id: objectId,
                });
                if (!restaurant) throw new Error("Restaurant not found");

                // Fetch cuisines using restaurantId
                const cuisines = await cuisineModel.find({
                    restaurantId: objectId, // Ensure restaurantId is ObjectId
                });

                // Prepare the Cuisine object to return
                const cuisineData =
                    cuisines.length > 0
                        ? {
                              restaurantId: cuisines[0].restaurantId.toString(), // Ensure restaurantId is string
                              cuisines: cuisines[0].cuisines, // Return the array of cuisines
                          }
                        : {
                              restaurantId: objectId.toString(),
                              cuisines: [], // If no cuisines found, return an empty array
                          };

                // Fetch reviews for the restaurant
                const reviews = await reviewModel.find({
                    restaurantId: objectId,
                });

                // Fetch the menu for the restaurant
                const menu = await menuModel
                    .findOne({ restaurantId: objectId })
                    .lean();
                if (!menu || !menu.dishes) {
                    throw new Error(
                        "Menu or dishes not found for this restaurant"
                    );
                }

                // Map the dishes, ensuring each dish has a fallback name and price
                const validDishes = menu.dishes.map((dish) => ({
                    ...dish,
                    name: dish.name || "Unnamed Dish", // Provide a fallback for name
                    price: dish.price || 0, // Provide a fallback for price
                }));

                // Return the full restaurant data including cuisines, reviews, and menu
                return {
                    ...restaurant.toObject(),
                    cuisines: cuisineData, // Return the Cuisine object instead of just a list
                    reviews,
                    menu: validDishes, // Include the validated dishes in the menu
                };
            } catch (error) {
                console.error("Error fetching restaurant:", error);
                throw new Error("Error fetching restaurant");
            }
        },

        getRestaurants: async (_, { name, cuisine, location, minRating }) => {
            const filters = {};

            // Filter by restaurant name
            if (name) filters.name = { $regex: `^${name}`, $options: "i" };

            // Filter by city/location
            if (location)
                filters["address.city"] = { $regex: location, $options: "i" };

            // Filter by minimum rating
            if (minRating) filters["ratings.average"] = { $gte: minRating };

            try {
                // Fetch restaurants based on filters
                let restaurants = await restaurantModel.find(filters);

                // If cuisine filter is provided, filter restaurants by their cuisines
                if (cuisine && Array.isArray(cuisine) && cuisine.length > 0) {
                    // Find restaurants with matching cuisines
                    const cuisineMatches = await cuisineModel.find({
                        cuisines: {
                            $in: cuisine.map((c) => new RegExp(c, "i")),
                        }, // Match any of the cuisines in the array
                    });

                    // Extract the restaurant IDs that match the cuisines
                    const restaurantIdsWithCuisine = cuisineMatches.map(
                        (cuisine) => cuisine.restaurantId.toString()
                    );

                    // Filter the restaurants to include only those with the matching cuisines
                    restaurants = restaurants.filter((restaurant) =>
                        restaurantIdsWithCuisine.includes(
                            restaurant._id.toString()
                        )
                    );
                }

                // Now, for each restaurant, fetch the associated cuisines
                const restaurantsWithCuisines = await Promise.all(
                    restaurants.map(async (restaurant) => {
                        // Find cuisines for each restaurant
                        const cuisineData = await cuisineModel.findOne({
                            restaurantId: restaurant._id.toString(), // Ensure matching type
                        });

                        // Prepare the Cuisine object to return
                        const cuisineInfo = cuisineData
                            ? {
                                  restaurantId:
                                      cuisineData.restaurantId.toString(),
                                  cuisines: cuisineData.cuisines,
                              }
                            : {
                                  restaurantId: restaurant._id.toString(),
                                  cuisines: [],
                              };

                        // Add the cuisines to the restaurant object
                        return {
                            ...restaurant.toObject(),
                            cuisines: cuisineInfo, // Include the Cuisine object
                        };
                    })
                );

                return restaurantsWithCuisines;
            } catch (error) {
                console.error("Error fetching restaurants:", error);
                throw new Error("Failed to fetch restaurants");
            }
        },
    },
};

export default restaurantResolvers;
