import { gql } from "apollo-server-express";

const cuisineTypeDefs = gql`
    type Cuisine {
        cuisineId: ID!
        name: String!
        description: String
        subcategories: [String]
        imageUrl: String
    }

    type Query {
        getCuisines(restaurantId: ID!): [Cuisine]
    }
`;

export default cuisineTypeDefs;
