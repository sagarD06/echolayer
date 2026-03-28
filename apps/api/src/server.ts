import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import app from "./app";

const PORT = 5000;

app.listen(PORT, () => { console.log("SERVER RUNNING ON PORT", PORT) })