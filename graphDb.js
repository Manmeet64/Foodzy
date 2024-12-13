import neo4j from "neo4j-driver";

// Create the driver instance
const driver = neo4j.driver(
    "bolt://localhost:7687", // e.g., "bolt://localhost:7687"
    neo4j.auth.basic("neo4j", "123456789")
);

/**
 * Create a new session with the specified access mode
 * @param {"READ" | "WRITE"} accessMode - The access mode for the session
 * @returns {Session} Neo4j session
 */
export const createSession = (accessMode = "WRITE") => {
    return driver.session({
        database: "foodzy", // Specify the database
        defaultAccessMode:
            accessMode === "READ" ? neo4j.session.READ : neo4j.session.WRITE,
    });
};

// Export the driver for optional manual use
export default driver;
