import type { Request, Response } from "express";
import { ClickHouseClient, createClient } from "@clickhouse/client";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const client: ClickHouseClient = createClient({
  host: process.env.CLICKHOUSE_HOST,
  username: process.env.CLICKHOUSE_USERNAME,
  password: process.env.CLICKHOUSE_PASSWORD,
});

const log = async (req: Request, res: Response) => {
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
  try {
    await client.insert({
      table: "logs",
      values: [requestSummary],
      format: "JSONEachRow",
    });
    client.close();
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};

export { log };
