import express, { Express } from "express";
import cors from "cors";
import { apiV1Route } from "./api/v1/index.js";

const app: Express = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1", apiV1Route);

app.listen(3001, () => {
  console.log("Primary backend Listening on port 3001");
});
