import { gql } from "apollo-server-express";

const restaurantTypeDefs = gql`
    type Address {
        street: String
        locality: String
        city: String
        state: String
        postalCode: String
        country: String
    }

    type Contact {
        phone: String
        email: String
    }

    type Ratings {
        average: Float
        count: Int
    }

    type Features {
        delivery: Boolean
        takeout: Boolean
        reservations: Boolean
        parking: String
    }

    type Photo {
        photoId: String
        url: String
    }

    type Restaurant {
        _id: ID!
        restaurantId: ID!
        name: String!
        description: String!
        address: Address!
        contact: Contact!
        hours: Hours
        estimatedDeliveryTime: String
        ratings: Ratings
        features: Features
        status: String
        cuisines: Cuisine
        menu: [Dish]
        reviews: [Review]
        photos: [Photo]
    }

    type Hours {
        day: String
        open: String
        close: String
    }

    type Query {
        getRestaurants(
            name: String
            cuisine: [String]
            location: String
            minRating: Float
            status: String
        ): [Restaurant]
        getRestaurantById(id: ID!): Restaurant
    }
`;

export default restaurantTypeDefs;
