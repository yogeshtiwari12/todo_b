import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://more-eft-34254.upstash.io", // ✅ Make sure it's the full URL with "https://"
  token: "AYXOAAIncDExY2MzOWNkNGFmMTc0M2RkODkzNzc5ZTY0MjQ2NWY5YnAxMzQyNTQ", // ✅ Replace this with your actual token
});

redis.ping()
  .then(() => console.log("✅ Connected to Upstash Redis"))
  .catch((error) => console.error("❌ Error connecting to Redis:", error.message));
export default redis
