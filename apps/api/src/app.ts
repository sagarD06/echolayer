import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimiter } from "./middleware/rate-limit.middleware";
import { errorHandler } from "./middleware/error.middleware";
import { appRouter } from "./routes";

const app: Application = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter);

// Define routes here
app.use("/api/v1", appRouter);

app.use(errorHandler);

export default app; 