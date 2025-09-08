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
}

export interface LessonProgress {
  lesson: number; // 0..6 (0 = preparatory / nama mantra)
  receivedAt: string | null; // ISO date or null if not yet received
}
