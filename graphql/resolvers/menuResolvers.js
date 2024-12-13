import menuModel from "../../models/menuModel.js";

const menuResolvers = {
    Query: {
        getMenu: async (_, { restaurantId }) => {
            try {
                const menu = await menuModel.findOne({ restaurantId });
                return menu ? menu.dishes : [];
            } catch (error) {
                console.error(error);
                throw new Error("Error fetching menu");
            }
        },
    },
};

export default menuResolvers;
