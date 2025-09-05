// Domain / API contract layer.
// These interfaces represent the JSON shape sent over the wire – not the
// persistence layer. Date values are serialized as ISO strings.
// If the DB schema changes, adapt mapping functions in the API package so the
// wire contract remains stable for the frontend.

export interface UserTrait {
  id: string;
  userId: string;
  trait: string;
}

// Multi-unit membership removed; single unit per user.

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  spiritualName: string | null;
  displayName: string | null;
  telegramHandle: string | null;
  whatsapp: string | null;
  photoUrl: string | null;
  dateOfBirth: string | null; // ISO date
  nationality: string | null;
  languages: string | null; // comma separated
  location: string | null;
  preferredLanguage: string | null;
  unitId: string | null;
  mentorId: string | null;
  acaryaId: string | null;
  lessons: LessonProgress[]; // ordered by lesson ascending (0..6)
  menteeIds: string[];
  initiateIds: string[];
  traits: UserTrait[];
}

export interface LessonProgress {
  lesson: number; // 0..6 (0 = preparatory / nama mantra)
  receivedAt: string | null; // ISO date or null if not yet received
}

export interface Unit {
  id: string;
  name: string;
  description: string | null;
  unofficialRegisteredAt: string | null; // ISO
  officialRegisteredAt: string | null; // ISO
  userIds: string[]; // users belonging to this unit
}

// Payload (input) contracts
export interface CreateUserPayload {
  email: string;
}

export interface UpdateUserPayload {
  email?: string;
  fullName?: string | null;
  spiritualName?: string | null;
  displayName?: string | null;
  telegramHandle?: string | null;
  whatsapp?: string | null;
  photoUrl?: string | null;
  dateOfBirth?: string | null;
  nationality?: string | null;
  languages?: string | null;
  location?: string | null;
  preferredLanguage?: string | null;
  unitId?: string | null;
  mentorId?: string | null;
  acaryaId?: string | null;
  lessons?: LessonProgress[];
}

// Auth payloads
export interface RegisterPayload {
  email: string;
  password: string;
}
export interface LoginPayload {
  email: string;
  password: string;
}
export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
}
export interface SetMenteesPayload {
  menteeIds: string[];
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

// Legacy payloads removed (single unit model)

// Re-export grouping for ergonomic import patterns: import { User } from '@am-crm/shared'
// Contract version constant removed; rely on package versioning.
