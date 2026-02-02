import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://guiding-hedgehog-6498.upstash.io",
  token: "ARliAAImcDEzNTVkOTJjYTgzNWI0YzVhYjM3ZTFmZjMzMzQzZGU2Y3AxNjQ5OA",
});

redis.ping()
  .then(() => console.log(" Connected to Upstash Redis"))
  .catch((error) => console.error(" Error connecting to Redis:", error.message));
export default redis
// rediss://default:ARliAAImcDEzNTVkOTJjYTgzNWI0YzVhYjM3ZTFmZjMzMzQzZGU2Y3AxNjQ5OA@guiding-hedgehog-6498.upstash.io:6379
// https://guiding-hedgehog-6498.upstash.io