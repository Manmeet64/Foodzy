import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import { createSession } from "../graphDb.js";

// Allowed values for the `status` field
const validStatuses = ["active", "on-duty", "off-duty"];

// Create a new DeliveryAgent
export const createDeliveryAgent = async (req, res) => {
    try {
        const { name, phone, email, status, current_location, vehicle_type } =
            req.body;

        // Validate the `status` field
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed values are: ${validStatuses.join(
                    ", "
                )}`,
            });
        }

        // Generate a unique ID for the delivery agent
        const id = uuidv4();

        // Save the delivery agent in Neo4j
        const session = createSession("WRITE");
        try {
            await session.run(
                `
                CREATE (d:DeliveryAgent {
                    id: $id,
                    name: $name,
                    phone: $phone,
                    email: $email,
                    status: $status,
                    current_location: $current_location,
                    vehicle_type: $vehicle_type
                })
                `,
                {
                    id,
                    name,
                    phone,
                    email,
                    status,
                    current_location,
                    vehicle_type,
                }
            );

            res.status(201).json({
                success: true,
                message: "Delivery agent created successfully",
                agent: {
                    id,
                    name,
                    phone,
                    email,
                    status,
                    current_location,
                    vehicle_type,
                },
            });
        } finally {
            session.close();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error creating delivery agent",
            error: error.message,
        });
    }
};

// Get all DeliveryAgents
export const getAllDeliveryAgents = async (req, res) => {
    try {
        const session = createSession("READ");
        try {
            const result = await session.run(
                `MATCH (d:DeliveryAgent) RETURN d`
            );

            const agents = result.records.map(
                (record) => record.get("d").properties
            );

            res.status(200).json({
                success: true,
                agents,
            });
        } finally {
            session.close();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching delivery agents",
            error: error.message,
        });
    }
};
//MOST IMPORTANT USAGE
export const getClosestDeliveryAgent = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        const session = createSession("READ");
        try {
            const result = await session.run(
                `MATCH (r:Restaurant {id: $restaurantId})-[:DELIVERS]->(d:DeliveryAgent)
                 RETURN d
                 ORDER BY r.distance
                 LIMIT 1`,
                { restaurantId }
            );

            if (result.records.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No delivery agents found for this restaurant",
                });
            }

            const agent = result.records[0].get("d").properties;

            res.status(200).json({
                success: true,
                agent,
            });
        } finally {
            session.close();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching delivery agent",
            error: error.message,
        });
    }
};

// Get a DeliveryAgent by ID
export const getDeliveryAgentById = async (req, res) => {
    try {
        const { id } = req.params;

        const session = createSession("READ");
        try {
            const result = await session.run(
                `MATCH (d:DeliveryAgent {id: $id}) RETURN d`,
                { id }
            );

            if (result.records.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Delivery agent not found",
                });
            }

            const agent = result.records[0].get("d").properties;

            res.status(200).json({
                success: true,
                agent,
            });
        } finally {
            session.close();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching delivery agent",
            error: error.message,
        });
    }
};

// Update a DeliveryAgent by ID
export const updateDeliveryAgent = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const session = createSession("WRITE");
        try {
            const result = await session.run(
                `MATCH (d:DeliveryAgent {id: $id}) RETURN d`,
                { id }
            );

            if (result.records.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Delivery agent not found",
                });
            }

            const setClause = Object.keys(updateData)
                .map((key) => `d.${key} = $${key}`)
                .join(", ");

            await session.run(
                `
                MATCH (d:DeliveryAgent {id: $id})
                SET ${setClause}
                RETURN d
                `,
                { id, ...updateData }
            );

            res.status(200).json({
                success: true,
                message: "Delivery agent updated successfully",
                agent: { id, ...updateData },
            });
        } finally {
            session.close();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating delivery agent",
            error: error.message,
        });
    }
};

// Delete a DeliveryAgent by ID
export const deleteDeliveryAgent = async (req, res) => {
    try {
        const { id } = req.params;

        const session = createSession("WRITE");
        try {
            const result = await session.run(
                `MATCH (d:DeliveryAgent {id: $id}) RETURN d`,
                { id }
            );

            if (result.records.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Delivery agent not found",
                });
            }

            await session.run(`MATCH (d:DeliveryAgent {id: $id}) DELETE d`, {
                id,
            });

            res.status(200).json({
                success: true,
                message: "Delivery agent deleted successfully",
            });
        } finally {
            session.close();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting delivery agent",
            error: error.message,
        });
    }
};
