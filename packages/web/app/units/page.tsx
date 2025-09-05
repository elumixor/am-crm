"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface UnitSummary {
  id: string;
  name: string;
  description: string | null;
  userIds: string[];
}

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!apiBase) throw new Error("API_BASE_URL is not defined");

export default function UnitsPage() {
  const [units, setUnits] = useState<UnitSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const router = useRouter();

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`${apiBase}/units`);
    if (res.ok) setUnits(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createUnit() {
    if (!newName.trim()) return;
    const res = await fetch(`${apiBase}/units`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    if (res.ok) {
      const unit = (await res.json()) as UnitSummary;
      router.push(`/units/${unit.id}`);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete unit?")) return;
    await fetch(`${apiBase}/units/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <main style={{ fontFamily: "system-ui", padding: 24, maxWidth: 900 }}>
      <h1>Units</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <input
          placeholder="New unit name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="button" onClick={createUnit} disabled={!newName.trim()}>
          Add
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : units.length === 0 ? (
        <p>No units yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", background: "#f5f5f5" }}>
              <th style={{ padding: 8 }}>Name</th>
              <th style={{ padding: 8 }}>Description</th>
              <th style={{ padding: 8 }}>Users</th>
              <th style={{ padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.id} style={{ borderTop: "1px solid #ddd" }}>
                <td style={{ padding: 8 }}>
                  <a href={`/units/${u.id}`} style={{ color: "#0366d6", textDecoration: "none" }}>
                    {u.name}
                  </a>
                </td>
                <td style={{ padding: 8 }}>{u.description || "-"}</td>
                <td style={{ padding: 8 }}>{u.userIds.length}</td>
                <td style={{ padding: 8 }}>
                  <button type="button" onClick={() => remove(u.id)} style={{ color: "#c00" }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
