import redis, {
  RedisClientType,
  RedisClientOptions,
  createClient,
} from "redis";
// const redisOptions: RedisClientOptions = {
//   url: "127.0.0.1:6379",
// };
const client: any = createClient({ url: "redis://127.0.0.1:6379" });
client.on("connect", () => console.log("Redis Client connected"));
client.on("ready", () => console.log("Redis Client connected ready to use"));
client.on("error", (error: Error) => console.log(error));
client.on("end", () => console.log("Redis Client disconnected"));
process.on("SIGINT", () => {
  if (!client.closed) {
    client.quit();
  }
  process.exit();
});
export { client };
