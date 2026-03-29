import { Cachekeys, CacheSet, CahceGet, TTL } from "@echolayer/cache";
import { prisma, Role } from "@echolayer/database";

import { AppError } from "../../utils/app-error";

export async function getCurrentUser(userId: string) {
    const cachedUser = await CahceGet<{
        id: string;
        name: string;
        email: string;
        phone: string;
        role: Role;
        organisationId: string;
        emailVerified: boolean;
        createdAt: Date;
    }>(Cachekeys.user(userId));

    if (cachedUser) {
        return cachedUser;
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            organisationId: true,
            emailVerified: true,
            createdAt: true
        }
    })

    if (!user) {
        throw new AppError("User not found", 404);
    }

    await CacheSet(Cachekeys.user(userId), user, TTL.USER);

    return user;
}