import dotenv from "dotenv";
import { ClickHouseClient, createClient } from "@clickhouse/client";

dotenv.config();

const client: ClickHouseClient = createClient({
  host: process.env.CLICKHOUSE_HOST,
  username: process.env.CLICKHOUSE_USERNAME,
  password: process.env.CLICKHOUSE_PASSWORD,
});

const clickhouse = {
  client,
};

export { clickhouse };
