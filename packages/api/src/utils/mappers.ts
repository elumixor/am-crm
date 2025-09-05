import type { LessonProgress, Unit as UnitDTO, User as UserDTO, UserTrait as UserTraitDTO } from "@am-crm/shared";
import type { Unit as PrismaUnit, User as PrismaUser, UserTrait as PrismaUserTrait } from "@prisma/client";

export const mapTrait = (t: PrismaUserTrait): UserTraitDTO => ({ id: t.id, userId: t.userId, trait: t.trait });

// Prisma user with optional relation includes we sometimes request.
type ExtendedPrismaUser = PrismaUser &
  Partial<{
    traits: PrismaUserTrait[];
    mentees: PrismaUser[];
    initiates: PrismaUser[];
  }>;

export const mapUser = (u: ExtendedPrismaUser): UserDTO => ({
  id: u.id,
  email: u.email,
  fullName: u.fullName ?? null,
  spiritualName: u.spiritualName ?? null,
  displayName: u.displayName ?? null,
  telegramHandle: u.telegramHandle ?? null,
  whatsapp: u.whatsapp ?? null,
  photoUrl: u.photoUrl ?? null,
  dateOfBirth: u.dateOfBirth ? u.dateOfBirth.toISOString() : null,
  nationality: u.nationality ?? null,
  languages: u.languages ?? null,
  location: u.location ?? null,
  preferredLanguage: u.preferredLanguage ?? null,
  unitId: u.unitId ?? null,
  mentorId: u.mentorId ?? null,
  acaryaId: (u as PrismaUser).acaryaId ?? null,
  menteeIds: (u.mentees ?? []).map((m) => m.id),
  initiateIds: (u.initiates ?? []).map((m) => m.id),
  lessons: Array.isArray((u as unknown as { lessons?: unknown }).lessons)
    ? (u as unknown as { lessons: LessonProgress[] }).lessons
    : [],
  traits: (u.traits ?? []).map(mapTrait),
});

export const mapUnit = (u: PrismaUnit): UnitDTO => ({
  id: u.id,
  name: u.name,
  description: u.description,
  unofficialRegisteredAt: u.unofficialRegisteredAt ? u.unofficialRegisteredAt.toISOString() : null,
  officialRegisteredAt: u.officialRegisteredAt ? u.officialRegisteredAt.toISOString() : null,
  userIds: [], // populated separately when needed
});
