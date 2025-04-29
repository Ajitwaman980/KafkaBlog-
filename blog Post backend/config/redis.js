import { Redis } from "ioredis";

const redis = new Redis({
  port: 6379,
});

// connection to redis
redis.on("connect", () => {
  console.log("Redis connected successfully");
});
redis.on("error", (err) => {
  console.error("Redis connection error:", err);
  setTimeout(() => {
    redis.connect();
  }, 5000);
});

export default redis;
