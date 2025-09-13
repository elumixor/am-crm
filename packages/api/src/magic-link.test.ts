import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { serve } from "bun";
import { generateToken } from "services/auth";
import { prisma } from "services/prisma";
import app from "./index";

let server: ReturnType<typeof serve>;
let testUser: { id: string; email: string };
let authToken: string;

beforeAll(async () => {
  await prisma.$connect();

  // Create a test user for authentication
  testUser = await prisma.user.upsert({
    where: { email: "acarya-test@example.com" },
    update: {},
    create: {
      email: "acarya-test@example.com",
      displayName: "Test Acarya",
      spiritualName: "Test Acarya",
    },
  });

  authToken = await generateToken(testUser.id);
  server = serve({ port: 0, fetch: app.fetch });
});

afterAll(async () => {
  // Clean up test data
  await prisma.magicLinkInvitation.deleteMany({
    where: { email: "newuser@example.com" },
  });
  await prisma.user.deleteMany({
    where: { email: "newuser@example.com" },
  });

  if (server) server.stop();
  await prisma.$disconnect();
});

describe("Magic Link API", () => {
  it("creates magic link invitation", async () => {
    const res = await fetch(`http://localhost:${server.port}/auth/create-magic-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ email: "newuser@example.com" }),
    });

    expect(res.status).toBe(201);
    const json = (await res.json()) as { token: string; expiresAt: string };
    expect(json.token).toBeDefined();
    expect(new Date(json.expiresAt)).toBeInstanceOf(Date);
  });

  it("prevents creating magic link for existing user", async () => {
    const res = await fetch(`http://localhost:${server.port}/auth/create-magic-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ email: testUser.email }),
    });

    expect(res.status).toBe(400);
    const json = (await res.json()) as { error: string };
    expect(json.error).toContain("already exists");
  });

  it("returns existing magic link if unused", async () => {
    // First request
    const res1 = await fetch(`http://localhost:${server.port}/auth/create-magic-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ email: "newuser2@example.com" }),
    });

    const json1 = (await res1.json()) as { token: string };

    // Second request for same email
    const res2 = await fetch(`http://localhost:${server.port}/auth/create-magic-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ email: "newuser2@example.com" }),
    });

    const json2 = (await res2.json()) as { token: string };
    expect(json1.token).toBe(json2.token);

    // Clean up
    await prisma.magicLinkInvitation.deleteMany({
      where: { email: "newuser2@example.com" },
    });
  });

  it("requires authentication for creating magic links", async () => {
    const res = await fetch(`http://localhost:${server.port}/auth/create-magic-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: "newuser3@example.com" }),
    });

    expect(res.status).toBe(401);
  });

  let magicToken: string;

  it("gets magic link information", async () => {
    // First create a magic link
    const createRes = await fetch(`http://localhost:${server.port}/auth/create-magic-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ email: "linkinfo@example.com" }),
    });

    const createJson = (await createRes.json()) as { token: string };
    magicToken = createJson.token;

    // Then get the info
    const res = await fetch(`http://localhost:${server.port}/auth/magic-link/${magicToken}`);

    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      email: string;
      expiresAt: string;
      createdBy: { email: string };
    };
    expect(json.email).toBe("linkinfo@example.com");
    expect(json.createdBy.email).toBe(testUser.email);
  });

  it("completes magic link registration", async () => {
    const res = await fetch(`http://localhost:${server.port}/auth/complete-magic-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: magicToken,
        password: "password123",
        spiritualName: "New Spiritual Name",
        preferredName: "Preferred Name",
      }),
    });

    expect(res.status).toBe(201);
    const json = (await res.json()) as {
      token: string;
      user: { id: string; email: string; spiritualName: string };
    };
    expect(json.token).toBeDefined();
    expect(json.user.email).toBe("linkinfo@example.com");
    expect(json.user.spiritualName).toBe("New Spiritual Name");

    // Clean up
    await prisma.user.delete({ where: { email: "linkinfo@example.com" } });
  });

  it("prevents using magic link twice", async () => {
    // Create a new magic link
    const createRes = await fetch(`http://localhost:${server.port}/auth/create-magic-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ email: "doubleuse@example.com" }),
    });

    const createJson = (await createRes.json()) as { token: string };
    const token = createJson.token;

    // Use it once
    await fetch(`http://localhost:${server.port}/auth/complete-magic-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password: "password123",
        spiritualName: "Test User",
      }),
    });

    // Try to use it again
    const res = await fetch(`http://localhost:${server.port}/auth/complete-magic-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password: "password123",
        spiritualName: "Test User",
      }),
    });

    expect(res.status).toBe(410);
    const json = (await res.json()) as { error: string };
    expect(json.error).toContain("already been used");

    // Clean up
    await prisma.user.delete({ where: { email: "doubleuse@example.com" } });
  });

  it("rejects invalid magic link token", async () => {
    const res = await fetch(`http://localhost:${server.port}/auth/magic-link/invalid-token`);

    expect(res.status).toBe(404);
    const json = (await res.json()) as { error: string };
    expect(json.error).toContain("Invalid magic link");
  });
});
