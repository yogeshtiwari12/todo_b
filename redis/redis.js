import Redis from "ioredis";

const redis  = new Redis({
    host: "https://todo-b-3dph.onrender.com",
    port: 6380
})

redis.ping()
    .then(() => console.log("connected to redis"))
    .catch((error) => console.log("error connecting to redis", error.message))

export default redis;