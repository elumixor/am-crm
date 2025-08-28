import { describe, expect, test } from "bun:test";
import { coreHealth } from "./index";

describe("coreHealth", () => {
  test("returns ok status", () => {
    const h = coreHealth();
    expect(h.ok).toBe(true);
    expect(typeof h.timestamp).toBe("number");
  });
});
