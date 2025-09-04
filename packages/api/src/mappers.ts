import type {
  Unit as UnitDTO,
  UnitMembership as UnitMembershipDTO,
  User as UserDTO,
  UserTrait as UserTraitDTO,
} from "@am-crm/shared";
import type {
  Unit as PrismaUnit,
  UnitMembership as PrismaUnitMembership,
  User as PrismaUser,
  UserTrait as PrismaUserTrait,
} from "@prisma/client";

export const mapTrait = (t: PrismaUserTrait): UserTraitDTO => ({
  id: t.id,
  createdAt: t.createdAt.toISOString(),
  userId: t.userId,
  trait: t.trait,
});

export const mapMembership = (m: PrismaUnitMembership): UnitMembershipDTO => ({
  id: m.id,
  createdAt: m.createdAt.toISOString(),
  userId: m.userId,
  unitId: m.unitId,
  role: m.role,
});

export const mapUser = (
  u: PrismaUser & { traits?: PrismaUserTrait[]; memberships?: PrismaUnitMembership[] },
): UserDTO => ({
  id: u.id,
  createdAt: u.createdAt.toISOString(),
  email: u.email,
  name: u.name,
  traits: (u.traits ?? []).map(mapTrait),
  memberships: (u.memberships ?? []).map(mapMembership),
});

export const mapUnit = (u: PrismaUnit & { memberships?: PrismaUnitMembership[] }): UnitDTO => ({
  id: u.id,
  createdAt: u.createdAt.toISOString(),
  name: u.name,
  description: u.description,
  memberships: (u.memberships ?? []).map(mapMembership),
});
