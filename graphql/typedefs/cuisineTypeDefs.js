import { gql } from "apollo-server-express";

const cuisineTypeDefs = gql`
    type Cuisine {
        restaurantId: ID!
        cuisines: [String]
    }

    extend type Query {
        getCuisines(restaurantId: ID!): Cuisine
        getCuisinesByType(cuisine: String!): [Cuisine]
    }
`;

export default cuisineTypeDefs;
