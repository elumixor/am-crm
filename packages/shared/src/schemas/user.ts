import { z } from "zod";

// Schemas shared between backend and frontend for user profile editing.
// Keep all fields optional so partial updates are possible.
// dateOfBirth is sent as ISO string (YYYY-MM-DD or full datetime) and parsed server-side.

export const UserSchema = z.object({
  id: z.string(),
  email: z.email(),
  spiritualName: z.string().nullable(),
  worldlyName: z.string().nullable(),
  preferredName: z.string().nullable(),
  preferredNameType: z.enum(["spiritual", "worldly", "custom"]),
  displayName: z.string().nullable(),
  telegram: z.string().nullable(),
  whatsapp: z.string().nullable(),
  photoKey: z.string().nullable(),
  dateOfBirth: z.date().nullable(),
  nationality: z.string().nullable(),
  languages: z.string().nullable(),
  location: z.string().nullable(),
  preferredLanguage: z.string().nullable(),
  unitId: z.string().nullable(),
  mentorId: z.string().nullable(),
  acaryaId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  mentees: z.array(z.object({ id: z.string() })).optional(),
  initiates: z.array(z.object({ id: z.string() })).optional(),
  // Computed fields for frontend
  fullName: z.string().optional(),
  photoUrl: z.string().optional(),
  menteeIds: z.array(z.string()).optional(),
});

export type User = z.infer<typeof UserSchema>;

const field = z.string().trim().min(1).or(z.string().optional());

export const userUpdateSchema = z.object({
  email: z.email().optional(), // usually immutable, but keep optional for future
  spiritualName: field,
  worldlyName: field,
  preferredNameType: z.enum(["spiritual", "worldly", "custom"]).optional(),
  preferredName: field,
  displayName: field,
  telegram: field,
  whatsapp: field,
  dateOfBirth: z.iso.date().optional(),
  nationality: field,
  languages: field,
  location: field,
  preferredLanguage: field,
});

export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
