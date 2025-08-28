import { describe, expect, test } from "bun:test";
import { UI_SCAFFOLD } from "./index";

describe("ui scaffold", () => {
  test("flag exported", () => {
    expect(UI_SCAFFOLD).toBe(true);
  });
});
