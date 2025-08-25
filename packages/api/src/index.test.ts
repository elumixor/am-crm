import { describe, it, expect } from 'vitest';
import app from './index';

describe('API root', () => {
  it('responds with ok true', async () => {
    const server = Bun.serve({ port: 0, fetch: app.fetch });
    const url = `http://localhost:${server.port}/`;
    const res = await fetch(url);
  const json: any = await res.json();
  expect(json.ok).toBe(true);
    server.stop();
  });
});