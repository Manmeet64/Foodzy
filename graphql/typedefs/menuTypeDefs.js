import { gql } from "apollo-server-express";

const menuTypeDefs = gql`
    type Dish {
        dishId: ID!
        name: String!
        description: String
        price: Float!
        imageUrl: String
        cuisine: String!
        moodTags: [String]!
        isPopular: Boolean
        ratings: Ratings
    }

    type Menu {
        menuId: ID!
        restaurantId: ID!
        dishes: [Dish]
    }

    type Query {
        getMenu(restaurantId: ID!): [Dish]
    }
`;

export default menuTypeDefs;
