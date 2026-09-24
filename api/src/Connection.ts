
import { RedisClient } from "bullmq"
import { Redis } from "ioredis"

export const connection = new Redis({ host: "localhost", port: 6379, maxRetriesPerRequest: null}) as unknown as RedisClient