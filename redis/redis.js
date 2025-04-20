import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://fancy-catfish-21450.upstash.io", // ✅ Make sure it's the full URL with "https://"
  token: "AVPKAAIjcDE3YWY1MTcxNDkyZDk0MWVlOGNhOGE3NGM1NWMwZWUzZnAxMA", // ✅ Replace this with your actual token
});

redis.ping()
  .then(() => console.log("✅ Connected to Upstash Redis"))
  .catch((error) => console.error("❌ Error connecting to Redis:", error.message));
export default redis
