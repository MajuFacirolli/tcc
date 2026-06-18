import "reflect-metadata"

// Satisfies env.ts validation without a real database connection.
// pg creates connection pools lazily, so no actual connection is attempted.
process.env.DATABASE_URL = "postgresql://mock:mock@localhost:5432/mock_test"
