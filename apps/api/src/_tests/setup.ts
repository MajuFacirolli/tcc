import "reflect-metadata"

process.env.DATABASE_URL = "postgresql://mock:mock@localhost:5432/mock_test"

process.env.JWT_SECRET = "test-jwt-secret".padEnd(48, "x")

process.env.REDIS_URL = "redis://localhost:6379"
process.env.SMTP_HOST = "localhost"
process.env.SMTP_PORT = "1025"
process.env.SMTP_USER = "test"
process.env.SMTP_PASS = "test"
process.env.SMTP_FROM = "no-reply@test.local"
