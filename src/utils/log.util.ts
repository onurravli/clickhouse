import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { clickhouse } from "../services";

const log = async (req: Request, res: Response) => {
  const id = uuidv4();
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const port = req.socket.remotePort;
  const path = req.path;
  const url = req.url;
  const method = req.method;
  const date = Date.now().toString();
  const query = req.query;
  const params = req.params;
  const cookies = req.cookies;
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
    cookies: cookies,
  };
  try {
    await clickhouse.client.insert({
      table: "logs",
      values: [requestSummary],
      format: "JSONEachRow",
    });
    clickhouse.client.close();
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};

export { log };
