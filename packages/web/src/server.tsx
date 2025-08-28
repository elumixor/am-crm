import { env, serve } from "bun";
import { Hono } from "hono";
import React from "react";
import { renderToString } from "react-dom/server";

const App = ({ users }: { users: Array<{ id: string; email: string; name: string | null }> }) => (
  <html>
    <head>
      <title>AM CRM</title>
    </head>
    <body>
      <h1>AM CRM Users</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.email}
            {u.name ? ` (${u.name})` : ""}
          </li>
        ))}
      </ul>
    </body>
  </html>
);

const app = new Hono();

app.get("/", async (c) => {
  const apiBase = env.API_BASE_URL || "http://localhost:3001";
  const res = await fetch(`${apiBase}/users`);
  const data = await res.json();
  const users = Array.isArray(data)
    ? data.map((u) => ({
        id: String(u.id),
        email: String(u.email),
        name: u.name == null ? null : String(u.name),
      }))
    : [];
  const html = renderToString(<App users={users} />);
  return c.html("<!DOCTYPE html>" + html);
});

export default {
  port: 3000,
  fetch: app.fetch,
};

if (import.meta.main) {
  serve({ port: 3000, fetch: app.fetch });
  console.log("Web server listening on http://localhost:3000");
}
