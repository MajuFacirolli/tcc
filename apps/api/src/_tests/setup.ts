import "reflect-metadata"

process.env.DATABASE_URL = "postgresql://mock:mock@localhost:5432/mock_test"

process.env.JWT_SECRET = "test-jwt-secret".padEnd(48, "x")
