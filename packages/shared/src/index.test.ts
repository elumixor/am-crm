import { describe, it, expect } from "bun:test";
import { helloShared } from "./index";

describe("helloShared", () => {
  it("returns phrase", () => {
    expect(helloShared()).toBe("shared works");
  });
});
