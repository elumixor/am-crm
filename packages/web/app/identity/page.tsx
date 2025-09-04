"use client";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string | null;
}
interface Unit {
  id: string;
  name: string;
  description?: string | null;
}
interface Membership {
  id: string;
  userId: string;
  unitId: string;
  role: string;
}

const apiBase = process.env.API_BASE_URL;
if (!apiBase) throw new Error("API_BASE_URL is not defined");

export default function IdentityPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [email, setEmail] = useState("");
  const [unitName, setUnitName] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [memberships, setMemberships] = useState<Membership[]>([]);

  async function load() {
    const u = (await fetch(`${apiBase}/users`)
      .then((r) => r.json())
      .catch(() => [])) as User[];
    setUsers(Array.isArray(u) ? u : []);
    const un = (await fetch(`${apiBase}/units`)
      .then((r) => r.json())
      .catch(() => [])) as Unit[];
    setUnits(Array.isArray(un) ? un : []);
    if (selectedUnit) {
      const mem = (await fetch(`${apiBase}/units/${selectedUnit}/members`)
        .then((r) => r.json())
        .catch(() => [])) as Membership[];
      setMemberships(Array.isArray(mem) ? mem : []);
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: selectedUnit is used
  useEffect(() => {
    load();
  }, [selectedUnit]);

  return (
    <main style={{ fontFamily: "system-ui", padding: 24, display: "grid", gap: 32 }}>
      <h1>Identity & Units (Phase 1)</h1>
      <section style={{ border: "1px solid #ddd", padding: 16 }}>
        <h2>Users</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!email) return;
            await fetch(`${apiBase}/users`, {
              method: "POST",
              body: JSON.stringify({ email }),
              headers: { "content-type": "application/json" },
            });
            setEmail("");
            load();
          }}
        >
          <input placeholder="email" value={email} onChange={(e) => setEmail((e.target as HTMLInputElement).value)} />
          <button type="submit">Add</button>
        </form>
        <ul>
          {users.map((u) => (
            <li
              key={u.id}
              onClick={() => setSelectedUser(u.id)}
              style={{ cursor: "pointer", fontWeight: selectedUser === u.id ? "bold" : undefined }}
            >
              {u.email}
              <button
                type="button"
                style={{ marginLeft: 8 }}
                onClick={async (ev) => {
                  ev.stopPropagation();
                  await fetch(`${apiBase}/users/${u.id}`, { method: "DELETE" });
                  load();
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section style={{ border: "1px solid #ddd", padding: 16 }}>
        <h2>Units</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!unitName) return;
            await fetch(`${apiBase}/units`, {
              method: "POST",
              body: JSON.stringify({ name: unitName }),
              headers: { "content-type": "application/json" },
            });
            setUnitName("");
            load();
          }}
        >
          <input
            placeholder="unit name"
            value={unitName}
            onChange={(e) => setUnitName((e.target as HTMLInputElement).value)}
          />
          <button type="submit">Add</button>
        </form>
        <ul>
          {units.map((u) => (
            <li
              key={u.id}
              onClick={() => setSelectedUnit(u.id)}
              style={{ cursor: "pointer", fontWeight: selectedUnit === u.id ? "bold" : undefined }}
            >
              {u.name}
              <button
                type="button"
                style={{ marginLeft: 8 }}
                onClick={async (ev) => {
                  ev.stopPropagation();
                  await fetch(`${apiBase}/units/${u.id}`, { method: "DELETE" });
                  if (selectedUnit === u.id) setSelectedUnit("");
                  load();
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </section>
      {selectedUnit && (
        <section style={{ border: "1px solid #ddd", padding: 16 }}>
          <h2>Memberships (Unit)</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select value={selectedUser} onChange={(e) => setSelectedUser((e.target as HTMLSelectElement).value)}>
              <option value="">-- pick user --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.email}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!selectedUser}
              onClick={async () => {
                if (!selectedUser) return;
                await fetch(`${apiBase}/units/${selectedUnit}/members`, {
                  method: "POST",
                  body: JSON.stringify({ userId: selectedUser }),
                });
                load();
              }}
            >
              Add Member
            </button>
          </div>
          <ul>
            {memberships.map((m) => (
              <li key={m.id}>
                {m.userId} ({m.role}){" "}
                <button
                  type="button"
                  onClick={async () => {
                    await fetch(`${apiBase}/units/${selectedUnit}/members/${m.userId}`, { method: "DELETE" });
                    load();
                  }}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
