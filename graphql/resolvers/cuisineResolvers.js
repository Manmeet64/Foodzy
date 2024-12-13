import cuisineModel from "../../models/cuisineModel.js";

const cuisineResolvers = {
    Query: {
        getCuisines: async (_, { restaurantId }) => {
            try {
                const cuisines = await cuisineModel.find({ restaurantId });
                return cuisines;
            } catch (error) {
                console.error(error);
                throw new Error("Error fetching cuisines");
            }
        },
    },
};

export default cuisineResolvers;
