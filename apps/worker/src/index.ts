import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { passwordResetEmailWorker, verificationEmailWorker, welcomeEmailWorker } from "./workers/emailWorkers";

console.log("[Worker] All workers started and listening for jobs...");

async function shutdown() {
    console.log("[Worker] Shutting down...");
    await verificationEmailWorker.close();
    await welcomeEmailWorker.close();
    await passwordResetEmailWorker.close();
    process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);