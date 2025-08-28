import { describe, expect, test } from "bun:test";
import { tooling } from "./index";

describe("config scaffold", () => {
  test("exports placeholder", () => {
    expect(tooling.notes).toContain("placeholder");
  });
});
