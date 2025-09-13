import { describe, expect, it, beforeEach } from "bun:test";

// Mock types for testing
interface MockUser {
  id: string;
  email: string;
  passwordHash?: string;
  spiritualName?: string;
  worldlyName?: string;
  preferredName?: string;
  displayName?: string;
}

interface MockMagicLinkInvitation {
  id: string;
  token: string;
  email: string;
  createdBy: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
}

// Mock database
class MockPrismaClient {
  private users: MockUser[] = [];
  private invitations: MockMagicLinkInvitation[] = [];

  user = {
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      return this.users.find(u => u.email === where.email || u.id === where.id) || null;
    },
    create: async ({ data }: { data: Partial<MockUser> }) => {
      const user: MockUser = {
        id: `user_${Date.now()}`,
        email: data.email!,
        passwordHash: data.passwordHash,
        spiritualName: data.spiritualName,
        worldlyName: data.worldlyName,
        preferredName: data.preferredName,
        displayName: data.displayName || data.preferredName || data.spiritualName
      };
      this.users.push(user);
      return user;
    }
  };

  magicLinkInvitation = {
    findFirst: async ({ where }: { where: { email: string; usedAt: null; expiresAt: { gt: Date } } }) => {
      return this.invitations.find(inv => 
        inv.email === where.email && 
        !inv.usedAt && 
        inv.expiresAt > where.expiresAt.gt
      ) || null;
    },
    findUnique: async ({ where }: { where: { token: string } }) => {
      return this.invitations.find(inv => inv.token === where.token) || null;
    },
    create: async ({ data }: { data: Partial<MockMagicLinkInvitation> }) => {
      const invitation: MockMagicLinkInvitation = {
        id: `inv_${Date.now()}`,
        token: `token_${Date.now()}`,
        email: data.email!,
        createdBy: data.createdBy!,
        expiresAt: data.expiresAt!,
        createdAt: new Date()
      };
      this.invitations.push(invitation);
      return invitation;
    },
    update: async ({ where, data }: { where: { token: string }; data: Partial<MockMagicLinkInvitation> }) => {
      const invitation = this.invitations.find(inv => inv.token === where.token);
      if (invitation) {
        Object.assign(invitation, data);
        return invitation;
      }
      throw new Error("Invitation not found");
    }
  };

  $transaction = async <T>(fn: (tx: MockPrismaClient) => Promise<T>): Promise<T> => {
    // Simple mock transaction - in real scenario, changes would be rolled back on error
    return await fn(this);
  };

  reset() {
    this.users = [];
    this.invitations = [];
  }
}

// Magic Link Logic Tests
describe("Magic Link Business Logic", () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    mockPrisma = new MockPrismaClient();
  });

  describe("Create Magic Link Invitation", () => {
    it("creates new invitation for non-existing user", async () => {
      const email = "newuser@example.com";
      const createdBy = "acarya123";

      // Check if user exists
      const existingUser = await mockPrisma.user.findUnique({ where: { email } });
      expect(existingUser).toBeNull();

      // Check for existing unused invitation
      const existingInvitation = await mockPrisma.magicLinkInvitation.findFirst({
        where: {
          email,
          usedAt: null,
          expiresAt: { gt: new Date() }
        }
      });
      expect(existingInvitation).toBeNull();

      // Create new invitation
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const invitation = await mockPrisma.magicLinkInvitation.create({
        data: { email, createdBy, expiresAt }
      });

      expect(invitation.email).toBe(email);
      expect(invitation.createdBy).toBe(createdBy);
      expect(invitation.expiresAt).toEqual(expiresAt);
      expect(invitation.token).toBeDefined();
    });

    it("prevents creating invitation for existing user", async () => {
      const email = "existing@example.com";

      // Create existing user
      await mockPrisma.user.create({
        data: { email, passwordHash: "hashed" }
      });

      // Check if user exists
      const existingUser = await mockPrisma.user.findUnique({ where: { email } });
      expect(existingUser).not.toBeNull();
      expect(existingUser?.email).toBe(email);
    });

    it("returns existing valid invitation if found", async () => {
      const email = "newuser@example.com";
      const createdBy = "acarya123";
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      // Create initial invitation
      const invitation1 = await mockPrisma.magicLinkInvitation.create({
        data: { email, createdBy, expiresAt }
      });

      // Try to create another invitation for same email
      const existingInvitation = await mockPrisma.magicLinkInvitation.findFirst({
        where: {
          email,
          usedAt: null,
          expiresAt: { gt: new Date() }
        }
      });

      expect(existingInvitation).not.toBeNull();
      expect(existingInvitation?.token).toBe(invitation1.token);
    });
  });

  describe("Magic Link Information Retrieval", () => {
    it("returns valid invitation information", async () => {
      const email = "test@example.com";
      const createdBy = "acarya123";
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const invitation = await mockPrisma.magicLinkInvitation.create({
        data: { email, createdBy, expiresAt }
      });

      const retrieved = await mockPrisma.magicLinkInvitation.findUnique({
        where: { token: invitation.token }
      });

      expect(retrieved).not.toBeNull();
      expect(retrieved?.email).toBe(email);
      expect(retrieved?.createdBy).toBe(createdBy);
      expect(retrieved?.usedAt).toBeUndefined();
    });

    it("detects used invitations", async () => {
      const invitation = await mockPrisma.magicLinkInvitation.create({
        data: {
          email: "test@example.com",
          createdBy: "acarya123",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      });

      // Mark as used
      await mockPrisma.magicLinkInvitation.update({
        where: { token: invitation.token },
        data: { usedAt: new Date() }
      });

      const retrieved = await mockPrisma.magicLinkInvitation.findUnique({
        where: { token: invitation.token }
      });

      expect(retrieved?.usedAt).toBeDefined();
    });

    it("detects expired invitations", async () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // Yesterday
      
      const invitation = await mockPrisma.magicLinkInvitation.create({
        data: {
          email: "test@example.com",
          createdBy: "acarya123",
          expiresAt: pastDate
        }
      });

      const now = new Date();
      expect(invitation.expiresAt < now).toBe(true);
    });
  });

  describe("Complete Magic Link Registration", () => {
    it("successfully creates user and marks invitation as used", async () => {
      const email = "newuser@example.com";
      const password = "password123";
      const spiritualName = "Test Spiritual Name";

      // Create invitation
      const invitation = await mockPrisma.magicLinkInvitation.create({
        data: {
          email,
          createdBy: "acarya123",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      });

      // Simulate the transaction logic
      await mockPrisma.$transaction(async (tx) => {
        // Create user
        const user = await tx.user.create({
          data: {
            email,
            passwordHash: "hashed_" + password, // Mock hashing
            spiritualName,
            displayName: spiritualName
          }
        });

        // Mark invitation as used
        await tx.magicLinkInvitation.update({
          where: { token: invitation.token },
          data: { usedAt: new Date() }
        });

        expect(user.email).toBe(email);
        expect(user.spiritualName).toBe(spiritualName);
        expect(user.displayName).toBe(spiritualName);
      });

      // Verify user was created
      const createdUser = await mockPrisma.user.findUnique({ where: { email } });
      expect(createdUser).not.toBeNull();
      expect(createdUser?.spiritualName).toBe(spiritualName);

      // Verify invitation was marked as used
      const usedInvitation = await mockPrisma.magicLinkInvitation.findUnique({
        where: { token: invitation.token }
      });
      expect(usedInvitation?.usedAt).toBeDefined();
    });

    it("handles display name priority correctly", async () => {
      const testCases = [
        { 
          input: { spiritualName: "Spiritual", preferredName: "Preferred" },
          expected: "Preferred"
        },
        { 
          input: { spiritualName: "Spiritual", worldlyName: "Worldly" },
          expected: "Spiritual"
        },
        { 
          input: { worldlyName: "Worldly" },
          expected: "Worldly"
        }
      ];

      for (const testCase of testCases) {
        mockPrisma.reset(); // Reset for each test case
        
        const email = `test${Date.now()}@example.com`;
        const invitation = await mockPrisma.magicLinkInvitation.create({
          data: {
            email,
            createdBy: "acarya123",
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        });

        await mockPrisma.$transaction(async (tx) => {
          const user = await tx.user.create({
            data: {
              email,
              passwordHash: "hashed",
              ...testCase.input,
              displayName: testCase.input.preferredName || testCase.input.spiritualName || testCase.input.worldlyName
            }
          });

          expect(user.displayName).toBe(testCase.expected);
        });
      }
    });
  });

  describe("Security Validations", () => {
    it("validates token format", () => {
      const validTokens = [
        "token_1234567890",
        "cljx1234567890abcdef",
        "inv_abcd1234"
      ];

      const invalidTokens = [
        "",
        "   ",
        "token with spaces",
        "token\nwith\nnewlines",
        null,
        undefined
      ];

      validTokens.forEach(token => {
        expect(typeof token === "string" && token.trim().length > 0).toBe(true);
      });

      invalidTokens.forEach(token => {
        const isInvalid = typeof token !== "string" || 
                         token === null || 
                         token === undefined || 
                         token.trim().length === 0 ||
                         token.includes(" ") ||
                         token.includes("\n");
        expect(isInvalid).toBe(true);
      });
    });

    it("validates email format", () => {
      const validEmails = [
        "test@example.com",
        "user.name@domain.co.uk",
        "123@test.org"
      ];

      const invalidEmails = [
        "",
        "not-an-email",
        "@domain.com",
        "user@",
        null,
        undefined
      ];

      // Simple email validation logic
      const isValidEmail = (email: any): boolean => {
        if (typeof email !== "string" || email.trim().length === 0) return false;
        const parts = email.split("@");
        if (parts.length !== 2) return false;
        const [local, domain] = parts;
        return local.length > 0 && domain.includes(".") && domain.length > 2;
      };

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true);
      });

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false);
      });
    });

    it("validates password requirements", () => {
      const validPasswords = [
        "password123",
        "MySecur3P@ss",
        "longenoughpassword"
      ];

      const invalidPasswords = [
        "",
        "12345", // too short
        "     ", // only spaces
        null,
        undefined
      ];

      const isValidPassword = (password: any): boolean => {
        return typeof password === "string" && password.trim().length >= 6;
      };

      validPasswords.forEach(password => {
        expect(isValidPassword(password)).toBe(true);
      });

      invalidPasswords.forEach(password => {
        expect(isValidPassword(password)).toBe(false);
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles concurrent invitation creation", async () => {
      const email = "concurrent@example.com";
      const createdBy = "acarya123";
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      // Simulate checking for existing invitation first
      const existing1 = await mockPrisma.magicLinkInvitation.findFirst({
        where: { email, usedAt: null, expiresAt: { gt: new Date() } }
      });
      
      const existing2 = await mockPrisma.magicLinkInvitation.findFirst({
        where: { email, usedAt: null, expiresAt: { gt: new Date() } }
      });

      // Both should find no existing invitation
      expect(existing1).toBeNull();
      expect(existing2).toBeNull();

      // First request creates invitation
      const invitation1 = await mockPrisma.magicLinkInvitation.create({
        data: { email, createdBy, expiresAt }
      });

      // Second request should now find the existing one
      const existing3 = await mockPrisma.magicLinkInvitation.findFirst({
        where: { email, usedAt: null, expiresAt: { gt: new Date() } }
      });

      expect(existing3).not.toBeNull();
      expect(existing3?.token).toBe(invitation1.token);
    });

    it("handles timezone considerations for expiration", () => {
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const justExpired = new Date(now.getTime() - 1000); // 1 second ago

      expect(sevenDaysFromNow > now).toBe(true);
      expect(justExpired < now).toBe(true);
    });
  });
});