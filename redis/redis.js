import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://rational-woodcock-19216.upstash.io", // ✅ Make sure it's the full URL with "https://"
  token: "AUsQAAIjcDFhYzFhOTJkMzhmOTQ0ZjVmOTg3OWY4MTIwYzNlNzlkOXAxMA", // ✅ Replace this with your actual token
});

redis.ping()
  .then(() => console.log("✅ Connected to Upstash Redis"))
  .catch((error) => console.error("❌ Error connecting to Redis:", error.message));
export default redis
