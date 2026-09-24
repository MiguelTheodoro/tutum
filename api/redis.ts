// redis.ts
import IORedis from "ioredis"

export const Connection = new IORedis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null, 
});