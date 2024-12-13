import reviewModel from "../../models/reviewModel.js";

const reviewResolvers = {
    Query: {
        getReviews: async (_, { restaurantId }) => {
            try {
                const reviews = await reviewModel.find({ restaurantId });
                return reviews;
            } catch (error) {
                console.error(error);
                throw new Error("Error fetching reviews");
            }
        },
    },
};

export default reviewResolvers;
