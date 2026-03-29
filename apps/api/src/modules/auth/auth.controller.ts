import { NextFunction, Request, Response } from "express"

import { ForgotPasswordInput, LoginInputType, RegisterInputType, ResetPasswordInput } from "@echolayer/schema"

import * as authService from "./auth.service"

const REFRESH_COOKIE = "refresh_token"

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}

export async function register(req: Request<{}, {}, RegisterInputType>, res: Response, next: NextFunction) {
    try {
        const result = await authService.RegisterUser(req.body)
        res.status(201).json(result)
    } catch (error) {
        next(error)
    }
}

export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.query.token as string
        if (!token) {
            return res.status(400).json({ error: "Verification token is required" });
        }
        const result = await authService.verifyEmail(token);

        res.json(result)
    } catch (error) {
        next(error)
    }
}

export async function login(req: Request<{}, {}, LoginInputType>, res: Response, next: NextFunction) {
    try {
        const { user, accessToken, refreshToken } = await authService.loginUser(req.body);

        res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);
        res.json({ user, accessToken });
    } catch (error) {
        next(error)
    }
}

export async function forgotPassword(req: Request<{}, {}, ForgotPasswordInput>, res: Response, next: NextFunction) {
    try {
        const result = await authService.forgotPassword(req.body);
        res.json(result);
    } catch (error) {
        next(error)
    }
}

export async function resetPassword(req: Request<{}, {}, ResetPasswordInput>, res: Response, next: NextFunction) {
    try {
        const result = await authService.resetPassword(req.body);
        res.json(result);
    } catch (error) {
        next(error)
    }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies[REFRESH_COOKIE];
        if(!token){
            return res.status(401).json({ error: "Refresh token is missing" });
        }
        const {accessToken, refreshToken} = await authService.refreshTokens(token);

        res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);
        res.json({ accessToken });
    } catch (error) {
        next(error)
    }
}

export async function logout(_req: Request, res: Response, next: NextFunction) {
    try {
        res.clearCookie(REFRESH_COOKIE);
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        next(error)
    }
}