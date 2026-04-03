import { CacheDelete, Cachekeys, CacheSet, CacheGet, TTL } from "@echolayer/cache";
import { prisma, Organisation, Role } from "@echolayer/database";

import { AppError } from "../../utils/app-error";

type OrgMember = {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: Role;
    createdAt: Date;
};

export async function getOrganisation(organisationId: string) {
    const cachedOrganisation = CacheGet<Organisation>(Cachekeys.org(organisationId));

    if (cachedOrganisation) {
        return cachedOrganisation;
    }

    const organisationData = await prisma.organisation.findUnique({
        where: { id: organisationId, isActive: true },
        select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true
        }
    })

    if (!organisationData) {
        return new AppError("Organisation not found", 404);
    }

    CacheSet(Cachekeys.org(organisationId), organisationData, TTL.ORG);

    return organisationData;
}

export async function getAllOrganisationMembers(organisationId: string): Promise<OrgMember[]> {

    const org = await prisma.organisation.findUnique({
        where: { id: organisationId, isActive: true },
    });

    if (!org) throw new AppError("Organisation not found", 404);

    const cached = await CacheGet<OrgMember[]>(
        Cachekeys.orgMembers(organisationId)
    );

    if (cached) {
        return cached;
    }

    const members = await prisma.user.findMany({
        where: { organisationId: organisationId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true
        }
    });

    await CacheSet(Cachekeys.orgMembers(organisationId), members, TTL.ORG_MEMBERS);

    return members;
}

export async function removeMemberFromOrganisation(organisationId: string, requestingUserId: string, targetUserId: string) {
    const organisation = await prisma.organisation.findUnique({
        where: { id: organisationId, isActive: true }
    })

    if (!organisation) { throw new AppError("Organisation not found", 404) };

    if (targetUserId === requestingUserId) {
        throw new AppError("You cannot remove yourself from the organisation", 400);
    }

    const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: {
            id: true,
            organisationId: true
        }
    });

    if (!targetUser || targetUser.organisationId !== organisationId) {
        throw new AppError("Member not found", 404);
    }

    await prisma.user.delete({
        where: { id: targetUserId }
    })

    await CacheDelete(Cachekeys.user(targetUserId));

    return { message: "Member removed successfully" };

}

export async function deleteOrganisation(organisationId: string) {
    const organisation = await prisma.organisation.findUnique({
        where: { id: organisationId, isActive: true }
    })

    if (!organisation) { throw new AppError("Organisation not found", 404) };

    await prisma.organisation.update({
        where: { id: organisationId },
        data: { isActive: false }
    })

    await CacheDelete(Cachekeys.org(organisationId));

    return { message: "Organisation deleted successfully" };
}