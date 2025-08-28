async function fetchUsers() {
  const base = process.env.API_BASE_URL || "http://localhost:3001";
  try {
    const res = await fetch(`${base}/users`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function Page() {
  const raw = await fetchUsers();
  const users: Array<{ id: string; email: string; name: string | null }> = Array.isArray(raw)
    ? raw.map((u: { id: string; email: string; name: string | null }) => ({
        id: String(u.id),
        email: String(u.email),
        name: u.name == null ? null : String(u.name),
      }))
    : [];
  return (
    <main style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>AM CRM Users</h1>
      {users.length === 0 && <p>No users yet.</p>}
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.email}
            {u.name ? ` (${u.name})` : ""}
          </li>
        ))}
      </ul>
    </main>
  );
}
