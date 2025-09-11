import type { AppType } from "@am-crm/api";
import { hc } from "hono/client";
import { env } from "./env";

// Single instance of the HTTP client for the Client
export const client = hc<AppType>(env.NEXT_PUBLIC_API_BASE_URL);

// Utility to check if response body has error
export function validateResponseBody<T>(body: T | { error: string }): asserts body is T {
  if (body instanceof Object && Reflect.has(body, "error")) throw new Error((body as { error: string }).error);
}
export function validResponse<T>(body: T | { error: string }): T {
  validateResponseBody(body);
  return body;
}
export async function validJsonInternal<T>(response: { json: () => Promise<T | { error: string }> }): Promise<T> {
  const body = await response.json();
  return validResponse(body);
}

export async function validJson<T>(request: Promise<{ json: () => Promise<T | { error: string }> }>): Promise<T> {
  const response = await request;
  const result = await validJsonInternal(response);
  return result;
}

export async function getSignedUrl(key: string): Promise<string> {
  const signedUrl = await client.signedUrl.$post({ json: { key } });
  const { url } = await validJsonInternal(signedUrl);
  return url;
}
