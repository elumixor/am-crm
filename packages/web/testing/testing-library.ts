import { afterEach, expect } from "bun:test";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";

// @ts-expect-error The typing between libs does not work well, but it is expected
expect.extend(matchers);

// Optional: cleans up `render` after each test
afterEach(() => cleanup());
