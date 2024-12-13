import Neode from "neode";

const deliveryModel = new Neode(
    "bolt://localhost:7687/foodzy",
    "neo4j",
    "123456789"
);

deliveryModel.model("DeliveryAgent", {
    id: {
        type: "string", // Automatically generate a UUID
        primary: true,
    },
    name: {
        type: "string",
        required: true,
    },
    phone: {
        type: "string",
        required: true,
        unique: true,
    },
    email: {
        type: "string",
        required: true,
        unique: true,
    },
    status: {
        type: "string",
        required: true,
        default: "active",
    },
    current_location: {
        type: "string",
    },
    vehicle_type: {
        type: "string",
        required: true,
    },
});
export default deliveryModel;
