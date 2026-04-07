import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import { Resend } from "resend";

let client: Resend | null = null;

export const getResendClient = (): Resend => {
    if (!client) {
        const API_KEY = process.env.RESEND_API_KEY;
        if (!API_KEY) {
            throw new Error("Resend API key is not set");
        }
        client = new Resend(API_KEY);
    }
    return client;
};