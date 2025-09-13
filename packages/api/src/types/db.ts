// Minimal type definitions for @am-crm/db until Prisma client can be generated

// Generic query argument types
interface WhereClause {
  [key: string]: unknown;
}

interface QueryArgs {
  where?: WhereClause;
  include?: Record<string, unknown>;
  select?: Record<string, unknown>;
  data?: Record<string, unknown>;
  orderBy?: Record<string, unknown>;
  take?: number;
  skip?: number;
}

interface CreateArgs {
  data: Record<string, unknown>;
}

interface UpdateArgs {
  where: WhereClause;
  data: Record<string, unknown>;
}

interface DeleteArgs {
  where: WhereClause;
}

interface UpsertArgs {
  where: WhereClause;
  create: Record<string, unknown>;
  update: Record<string, unknown>;
}

interface BatchResult {
  count: number;
}

export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  spiritualName?: string;
  worldlyName?: string;
  preferredName?: string;
  displayName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MagicLinkInvitation {
  id: string;
  token: string;
  email: string;
  createdBy: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
  creator?: User;
}

export interface PrismaClient {
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
  $transaction<T>(fn: (tx: PrismaClient) => Promise<T>): Promise<T>;
  user: {
    findUnique(args: QueryArgs): Promise<User | null>;
    findFirst(args: QueryArgs): Promise<User | null>;
    findMany(args: QueryArgs): Promise<User[]>;
    create(args: CreateArgs): Promise<User>;
    update(args: UpdateArgs): Promise<User>;
    delete(args: DeleteArgs): Promise<User>;
    upsert(args: UpsertArgs): Promise<User>;
    deleteMany(args: QueryArgs): Promise<BatchResult>;
  };
  magicLinkInvitation: {
    findUnique(args: QueryArgs): Promise<MagicLinkInvitation | null>;
    findFirst(args: QueryArgs): Promise<MagicLinkInvitation | null>;
    findMany(args: QueryArgs): Promise<MagicLinkInvitation[]>;
    create(args: CreateArgs): Promise<MagicLinkInvitation>;
    update(args: UpdateArgs): Promise<MagicLinkInvitation>;
    delete(args: DeleteArgs): Promise<MagicLinkInvitation>;
    deleteMany(args: QueryArgs): Promise<BatchResult>;
  };
}

export type { PrismaClient };