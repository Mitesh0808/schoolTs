"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const redis_1 = require("redis");
// const redisOptions: RedisClientOptions = {
//   url: "127.0.0.1:6379",
// };
const client = (0, redis_1.createClient)({ url: "redis://127.0.0.1:6379" });
exports.client = client;
client.on("connect", () => console.log("Redis Client connected"));
client.on("ready", () => console.log("Redis Client connected ready to use"));
client.on("error", (error) => console.log(error));
client.on("end", () => console.log("Redis Client disconnected"));
process.on("SIGINT", () => {
    if (!client.closed) {
        client.quit();
    }
    process.exit();
});
