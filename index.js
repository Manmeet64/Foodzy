import express from "express";
import cors from "cors";
import connectDB from "./dbConnection.js";
import authRouter from "./routes/authRouter.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import firebaseAdmin from "./firebase.js";
import restaurantRouter from "./routes/restaurantRouter.js";
import menuRouter from "./routes/menuRouter.js";
import cuisineRouter from "./routes/cuisineRouter.js";
import deliveryRouter from "./routes/deliveryRouter.js";
import eventRouter from "./routes/eventRouter.js";
import notificationRouter from "./routes/notificationRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import userRouter from "./routes/userRouter.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4"; // Express middleware for Apollo Server
import typeDefs from "./graphql/typedefs/index.js";
import resolvers from "./graphql/resolvers/index.js";

// app object express
const app = express();

// Connecting to database
connectDB();

// Set up Apollo Server (GraphQL server)
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
});

await apolloServer.start(); // Start Apollo Server

// Middlewares
app.use(cors());
app.use(express.json());

// Mount the Apollo GraphQL endpoint
app.use("/graphql", expressMiddleware(apolloServer)); // This is where GraphQL will be available
app.use("/notification", notificationRouter);
// Other routes and middlewares
app.use("/delivery", deliveryRouter);
app.use("/event", eventRouter);
app.use("/admin", restaurantRouter);
app.use(authMiddleware); // Uncomment this line to add the authentication middleware globally
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/menus", menuRouter);
app.use("/cuisines", cuisineRouter);
app.use("/reviews", reviewRouter);

// Port listening, started as a service
app.listen(8000, () => {
    console.log("Server is up and running on port 8000");
});
