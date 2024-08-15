import { loadEnv } from "@/config";
import cors from "cors";
import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import "express-async-errors";

loadEnv();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(helmet());

app.get("/health", (_req: Request, res: Response) => res.send("OK!"));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
