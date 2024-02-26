import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { log } from "./utils";

dotenv.config();

const app: Application = express();
const port: number = parseInt(process.env.PORT as string);

app.all("*", async (req: Request, res: Response) => {
  await log(req, res);
  return res.status(200).json({
    message: "Hello, world. :)",
  });
});

app.listen(port, () => {
  console.log(`Running on ${port}.`);
});
