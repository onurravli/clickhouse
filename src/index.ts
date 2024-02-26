import express, { Application, Request, Response } from "express";
import { ClickHouseClient, createClient } from "@clickhouse/client";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app: Application = express();
const port: number = parseInt(process.env.PORT as string);
const client: ClickHouseClient = createClient({
  host: process.env.CLICKHOUSE_HOST,
  username: process.env.CLICKHOUSE_USERNAME,
  password: process.env.CLICKHOUSE_PASSWORD,
});

app.all("*", async (req: Request, res: Response) => {
  const id = uuidv4();
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const port = req.socket.remotePort;
  const path = req.path;
  const url = req.url;
  const method = req.method;
  const date = Date.now();
  const query = req.query;
  const params = req.params;
  const requestSummary = {
    ip: ip,
    port: port,
    path: path,
    url: url,
    id: id.toString(),
    method: method,
    date: date,
    query: JSON.stringify(query),
    params: JSON.stringify(params),
  };
  client
    .insert({
      table: "logs",
      values: [requestSummary],
      format: "JSONEachRow",
    })
    .then(() => {
      console.log("Inserted.");
    })
    .catch((error) => {
      console.log(`Error: ${(error as Error).message}`);
    })
    .finally(() => {
      client.close();
    });
  return res.status(200).json(requestSummary);
});

app.listen(port, () => {
  console.log(`Running on ${port}.`);
});
