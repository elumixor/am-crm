"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChipsSelector } from "../../../components/ChipsSelector";

interface User {
  id: string;
  email: string;
  displayName: string | null;
  spiritualName: string | null;
  fullName: string | null;
  unitId: string | null;
}
interface UnitDetail {
  id: string;
  name: string;
  description: string | null;
  userIds: string[];
  users?: User[]; // from detail endpoint
}

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!apiBase) throw new Error("API_BASE_URL is not defined");

export default function UnitProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [unit, setUnit] = useState<UnitDetail | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${apiBase}/units/${id}`);
      if (res.ok) setUnit(await res.json());
      const usersRes = await fetch(`${apiBase}/users`);
      if (usersRes.ok) setAllUsers(await usersRes.json());
    })();
  }, [id]);

  function update<K extends keyof UnitDetail>(key: K, value: UnitDetail[K]) {
    setUnit((u) => (u ? { ...u, [key]: value } : u));
  }

  async function save() {
    if (!unit) return;
    setSaving(true);
    await fetch(`${apiBase}/units/${unit.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: unit.name, description: unit.description, userIds: unit.userIds }),
    });
    setSaving(false);
    router.refresh();
  }

  if (!unit) return <main style={{ padding: 24 }}>Loading...</main>;

  const userItems = allUsers.map((u) => ({
    id: u.id,
    label: u.displayName || u.spiritualName || u.fullName || u.email,
  }));

  return (
    <main style={{ fontFamily: "system-ui", padding: 24, maxWidth: 800 }}>
      <a href="/units" style={{ textDecoration: "none", color: "#0366d6" }}>
        ← Back to units
      </a>
      <h1 style={{ marginTop: 12 }}>Unit: {unit.name}</h1>
      <div style={{ display: "grid", gap: 16 }}>
        <label style={{ display: "grid", gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>Name</span>
          <input value={unit.name} onChange={(e) => update("name", e.target.value)} />
        </label>
        <label style={{ display: "grid", gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>Description</span>
          <textarea
            value={unit.description || ""}
            onChange={(e) => update("description", e.target.value || null)}
            rows={3}
          />
        </label>
        <ChipsSelector
          label="Users"
          selectedIds={unit.userIds}
          items={userItems.map((u) => ({ ...u, href: `/users/${u.id}` }))}
          onChange={(ids) => update("userIds", ids)}
          placeholder="Search users..."
        />
        <div style={{ display: "flex", gap: 12 }}>
          <button type="button" onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={() => router.push("/units")}>
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}
