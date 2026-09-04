import "reflect-metadata"

process.env.DATABASE_URL = "postgresql://mock:mock@localhost:5432/mock_test"

process.env.JWT_SECRET = "test-jwt-secret".padEnd(48, "x")

process.env.REDIS_URL = "redis://localhost:6379"

// Mounts the queue dashboard under Basic auth; dashboard.test.ts reuses these.
process.env.DASHBOARD_USER = "ops"
process.env.DASHBOARD_PASSWORD = "dashboard-test-password"
process.env.SMTP_HOST = "localhost"
process.env.SMTP_PORT = "1025"
process.env.SMTP_USER = "test"
process.env.SMTP_PASS = "test"
process.env.SMTP_FROM = "no-reply@test.local"
