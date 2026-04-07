import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import jwt from "jsonwebtoken";

export interface TokenPayload {
    userId: string;
    email: string;
}

export function signAccessTokeen(payload: TokenPayload) {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, { expiresIn: "30m" });
}

export function signRefreshToken(payload: TokenPayload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" });
};

export function verifyAccessToken(token: string) {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as TokenPayload;
}

export function verifyRefreshToken(token: string) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as TokenPayload;
}