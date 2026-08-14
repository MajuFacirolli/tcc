import IORedis from "ioredis"
import { env } from "@/env"

export function createRedisConnection(): IORedis {
	return new IORedis(env.REDIS_URL, {
		maxRetriesPerRequest: null,
	})
}

export const redisConnection = createRedisConnection()
