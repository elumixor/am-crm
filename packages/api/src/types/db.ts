// Minimal type definitions for @am-crm/db until Prisma client can be generated
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
    findUnique(args: any): Promise<User | null>;
    findFirst(args: any): Promise<User | null>;
    findMany(args: any): Promise<User[]>;
    create(args: any): Promise<User>;
    update(args: any): Promise<User>;
    delete(args: any): Promise<User>;
    upsert(args: any): Promise<User>;
    deleteMany(args: any): Promise<any>;
  };
  magicLinkInvitation: {
    findUnique(args: any): Promise<MagicLinkInvitation | null>;
    findFirst(args: any): Promise<MagicLinkInvitation | null>;
    findMany(args: any): Promise<MagicLinkInvitation[]>;
    create(args: any): Promise<MagicLinkInvitation>;
    update(args: any): Promise<MagicLinkInvitation>;
    delete(args: any): Promise<MagicLinkInvitation>;
    deleteMany(args: any): Promise<any>;
  };
}

export { PrismaClient as PrismaClient };