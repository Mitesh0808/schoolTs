import express, { Application, Request, Response } from "express";
import { Server } from "http";
import cors from "cors";
import * as swaggerUi from "swagger-ui-express";
import swaggerJSONDocument from "./swagger.json";
import cookieParser from "cookie-parser";
import notFound from "./middleware/not-found";
import connectToDb from "./connectDb/connectDb";
import router from "./routers/index";
import { client } from "./utils/redis";
(async () => {
  await client.connect();
})();
const app: Application = express();
connectToDb();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJSONDocument));
app.use("/", router);

app.use(notFound);
const server: Server = app.listen(5000, () => {
  console.log("server live on 5000");
});
