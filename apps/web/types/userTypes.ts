import { UserRole } from "@echolayer/schema"

export interface IUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    organisationId: string;
    emailVerified: boolean;
    createdAt: Date;
}

export interface IAuthTokens {
    accessToken: string;
}