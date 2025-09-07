import type { LessonProgress, Unit as UnitDTO, User as UserDTO, UserTrait as UserTraitDTO } from "@am-crm/shared";
import { di } from "@elumixor/di";
import type { Unit as PrismaUnit, User as PrismaUser, UserTrait as PrismaUserTrait } from "@prisma/client";
import { AWSUploadService } from "./aws-upload-service";

export const mapTrait = (t: PrismaUserTrait): UserTraitDTO => ({ id: t.id, userId: t.userId, trait: t.trait });

// Prisma user with optional relation includes we sometimes request.
type ExtendedPrismaUser = PrismaUser &
  Partial<{
    traits: PrismaUserTrait[];
    mentees: PrismaUser[];
    initiates: PrismaUser[];
  }>;

export async function mapUser(u: ExtendedPrismaUser): Promise<UserDTO> {
  return {
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    spiritualName: u.spiritualName,
    displayName: u.displayName,
    telegramHandle: u.telegramHandle,
    whatsapp: u.whatsapp,
    // Do not expose DB key; routes will generate a signed URL per request if a photoKey exists
    photoUrl: u.photoKey ? await di.inject(AWSUploadService).getSignedUrl(u.photoKey) : null,
    dateOfBirth: u.dateOfBirth ? u.dateOfBirth.toISOString() : null,
    nationality: u.nationality,
    languages: u.languages,
    location: u.location,
    preferredLanguage: u.preferredLanguage,
    unitId: u.unitId,
    mentorId: u.mentorId,
    acaryaId: u.acaryaId,
    menteeIds: (u.mentees ?? []).map((m) => m.id),
    initiateIds: (u.initiates ?? []).map((m) => m.id),
    lessons: Array.isArray(u.lessons) ? (u as unknown as { lessons: LessonProgress[] }).lessons : [],
    traits: (u.traits ?? []).map(mapTrait),
  };
}

export const mapUnit = (u: PrismaUnit): UnitDTO => ({
  id: u.id,
  name: u.name,
  description: u.description,
  unofficialRegisteredAt: u.unofficialRegisteredAt ? u.unofficialRegisteredAt.toISOString() : null,
  officialRegisteredAt: u.officialRegisteredAt ? u.officialRegisteredAt.toISOString() : null,
  userIds: [],
});
