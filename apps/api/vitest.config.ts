import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		// Closing pg pools, BullMQ queues and ioredis handles takes a moment.
		teardownTimeout: 20_000,
		/**
		 * Two lanes, one command. `setupFiles` must stay inside each project: the unit
		 * setup points DATABASE_URL at a host that does not exist, and leaking that into
		 * the integration lane would break it in a confusing way.
		 *
		 * `isolate` is left at its default. It is what gives each test file a fresh
		 * module graph, so the `db`, `redisConnection`, `queues` and `container`
		 * singletons are rebuilt per file and container rebinds cannot leak between
		 * files. Turning it off for speed would silently reintroduce that coupling.
		 */
		projects: [
			{
				extends: true,
				test: {
					name: "unit",
					environment: "node",
					include: ["src/_tests/**/*.test.ts"],
					exclude: ["src/_tests/integration/**"],
					setupFiles: ["./src/_tests/setup.unit.ts"],
				},
			},
			{
				extends: true,
				test: {
					name: "integration",
					environment: "node",
					include: ["src/_tests/integration/**/*.test.ts"],
					setupFiles: ["./src/_tests/integration/setup.ts"],
					globalSetup: ["./src/_tests/integration/globalSetup.ts"],
					// One database and one Redis index are shared across files, so files
					// run one at a time. `forks` lets a process holding an open pg or
					// ioredis handle be reaped instead of hanging the run.
					pool: "forks",
					fileParallelism: false,
					testTimeout: 30_000,
					hookTimeout: 60_000,
				},
			},
		],
	},
	resolve: {
		tsconfigPaths: true,
	},
})
