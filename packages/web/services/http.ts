import type { AppType } from "@am-crm/api";
import { hc } from "hono/client";
import { env } from "./env";

// Single instance of the HTTP client for the Client
export const client = hc<AppType>(env.NEXT_PUBLIC_API_BASE_URL);
