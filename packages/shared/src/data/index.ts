// Domain / API contract layer.
// These interfaces represent the JSON shape sent over the wire – not the
// persistence layer. Date values are serialized as ISO strings.
// If the DB schema changes, adapt mapping functions in the API package so the
// wire contract remains stable for the frontend.

export interface UserTrait {
  id: string;
  createdAt: string; // ISO date
  userId: string;
  trait: string;
}

export type UnitRole = "MEMBER" | "SECRETARY";

export interface UnitMembership {
  id: string;
  createdAt: string; // ISO date
  userId: string;
  unitId: string;
  role: UnitRole;
}

export interface User {
  id: string;
  createdAt: string; // ISO date
  email: string;
  name: string | null;
  traits: UserTrait[];
  memberships: UnitMembership[];
}

export interface Unit {
  id: string;
  createdAt: string; // ISO date
  name: string;
  description: string | null;
  memberships: UnitMembership[];
}

// Payload (input) contracts
export interface CreateUserPayload {
  email: string;
  name?: string | null;
}

export interface UpdateUserPayload {
  email?: string;
  name?: string | null;
}

export interface CreateUnitPayload {
  name: string;
  description?: string | null;
}

export interface UpdateUnitPayload {
  name?: string;
  description?: string | null;
}

// Membership / trait payloads
export interface AddTraitPayload {
  trait: string;
}

export interface AddMemberPayload {
  userId: string;
  role?: UnitRole;
}

// Re-export grouping for ergonomic import patterns: import { User } from '@am-crm/shared'
export const __version = "0.0.1-contracts";
