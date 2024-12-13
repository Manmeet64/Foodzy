import restaurantResolvers from "./restaurantResolvers.js";
import cuisineResolvers from "./cuisineResolvers.js";
import menuResolvers from "./menuResolvers.js";
import reviewResolvers from "./reviewResolvers.js";

const resolvers = {
    Query: {
        ...restaurantResolvers.Query,
        ...cuisineResolvers.Query,
        ...menuResolvers.Query,
        ...reviewResolvers.Query,
    },
};

export default resolvers;
