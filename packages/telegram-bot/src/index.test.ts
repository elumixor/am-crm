import { describe, expect, it } from "bun:test";

// Dummy test to ensure the telegram bot module loads without side effects like starting the bot.
describe("telegram-bot module", () => {
  it("imports without throwing", async () => {
    const mod = await import("./index");
    // The module currently exports nothing; just assert we got an object.
    expect(typeof mod).toBe("object");
  });
});
