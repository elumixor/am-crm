"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { nonNullAssert } from "@elumixor/frontils";

interface User {
  id: string;
  email: string;
  fullName: string | null;
  spiritualName: string | null;
  displayName: string | null;
  telegramHandle: string | null;
  whatsapp: string | null;
  photoUrl: string | null;
  dateOfBirth: string | null;
  nationality: string | null;
  languages: string | null;
  location: string | null;
  preferredLanguage: string | null;
  unitId: string | null;
  mentorId: string | null;
  menteeIds: string[];
}
interface Unit {
  id: string;
  name: string;
}

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!apiBase) throw new Error("API_BASE_URL is not defined");

const fieldDefs: { key: keyof User; label: string; type?: string; readOnly?: boolean }[] = [
  { key: "email", label: "Email", readOnly: true },
  { key: "fullName", label: "Full Name" },
  { key: "spiritualName", label: "Spiritual Name" },
  { key: "displayName", label: "Display Name" },
  { key: "telegramHandle", label: "Telegram" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "dateOfBirth", label: "Date of Birth", type: "date" },
  { key: "nationality", label: "Nationality" },
  { key: "languages", label: "Languages" },
  { key: "location", label: "Location" },
  { key: "preferredLanguage", label: "Preferred Language" },
];

export default function ProfilePage() {
  const { token, userId, logout } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false); // NEW
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }
    // Load profile
    (async () => {
      const res = await fetch(`${apiBase}/me`, { headers: { authorization: `Bearer ${token}` } });
      if (res.ok) setUser(await res.json());
      const unitsRes = await fetch(`${apiBase}/units`);
      if (unitsRes.ok) setUnits(await unitsRes.json());
      const allUsers = await fetch(`${apiBase}/users`)
        .then((r) => r.json())
        .catch(() => []);
      setUsers(allUsers);
    })();
  }, [token, router]);

  if (!token) return null;

  function updateField<K extends keyof User>(key: K, value: User[K]) {
    setUser((u) => (u ? { ...u, [key]: value } : u));
  }

  async function uploadPhoto(file: File) {
    if (!token) return;
    setUploadingPhoto(true);
    try {
      const form = new FormData();
      form.append("photo", file);
      const res = await fetch(`${apiBase}/me/photo`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body: form,
      });
      if (res.ok) {
        const { url } = (await res.json()) as { url: string };
        nonNullAssert(url);
        setUser((u) => (u ? { ...u, photoUrl: url } : u));
        setPhotoFile(file);
      }
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function save() {
    if (!user) return;
    setSaving(true);
    // Photo upload removed (now immediate on selection)
    const body: Partial<User> = { ...user };
    await fetch(`${apiBase}/me`, {
      method: "PUT",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    await fetch(`${apiBase}/me/mentees`, {
      method: "PUT",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ menteeIds: user.menteeIds }),
    });
    setSaving(false);
  }

  async function deleteAccount() {
    if (!userId) return;
    // Using admin endpoint for now (MVP) – in future provide /me DELETE with auth.
    await fetch(`${apiBase}/users/${userId}`, { method: "DELETE" });
    logout();
    router.replace("/register");
  }

  return (
    <main style={{ fontFamily: "system-ui", padding: 24, maxWidth: 800 }}>
      <h1>My Profile</h1>
      {user ? (
        <div style={{ display: "grid", gap: 24 }}>
          <section style={{ display: "flex", gap: 24 }}>
            <div>
              <div
                style={{
                  width: 120,
                  height: 120,
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundImage: user.photoUrl ? `url(${user.photoUrl})` : "url(/images/user.png)",
                }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadPhoto(file);
                }}
                style={{ marginTop: 8 }}
              />
              {uploadingPhoto && <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>Uploading...</div>}
            </div>
            <div style={{ flex: 1, display: "grid", gap: 12 }}>
              {fieldDefs.map((f) => (
                <label key={f.key} style={{ display: "grid", gap: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{f.label}</span>
                  <input
                    type={f.type || "text"}
                    value={user[f.key] || ""}
                    disabled={f.readOnly}
                    onChange={(e) => {
                      if (f.readOnly) return;
                      updateField(f.key, (e.target.value || null) as User[typeof f.key]);
                    }}
                  />
                </label>
              ))}
              <label style={{ display: "grid", gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>Unit</span>
                <select value={user.unitId || ""} onChange={(e) => updateField("unitId", e.target.value || null)}>
                  <option value="">-- none --</option>
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ display: "grid", gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>Mentor</span>
                <select value={user.mentorId || ""} onChange={(e) => updateField("mentorId", e.target.value || null)}>
                  <option value="">-- none --</option>
                  {users
                    .filter((u) => u.id !== user.id)
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.displayName || u.email}
                      </option>
                    ))}
                </select>
              </label>
              <MenteesSelector
                users={users}
                selfId={user.id}
                menteeIds={user.menteeIds}
                onChange={(ids: string[]) => updateField("menteeIds", ids)}
              />
              <div style={{ display: "flex", gap: 12 }}>
                <button type="button" onClick={save} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button type="button" onClick={logout}>
                  Logout
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  style={{ marginLeft: "auto", color: "#c00" }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {confirmDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ background: "white", padding: 24, borderRadius: 8, width: 360 }}>
            <h3 style={{ marginTop: 0 }}>Confirm Deletion</h3>
            <p style={{ fontSize: 14 }}>
              This will permanently delete your account. This action cannot be undone. Proceed?
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setConfirmDelete(false)}>
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteAccount}
                style={{ background: "#c00", color: "white", padding: "6px 12px" }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

interface MenteesSelectorProps {
  users: User[];
  selfId: string;
  menteeIds: string[];
  onChange: (ids: string[]) => void;
}

function MenteesSelector({ users, selfId, menteeIds, onChange }: MenteesSelectorProps) {
  const [query, setQuery] = useState("");
  const selectable = users.filter((u) => u.id !== selfId && !menteeIds.includes(u.id));
  const filtered = !query
    ? selectable
    : selectable.filter((u) =>
        (u.displayName || u.spiritualName || u.email).toLowerCase().includes(query.toLowerCase()),
      );

  return (
    <div style={{ display: "grid", gap: 4 }}>
      <span style={{ fontSize: 12, fontWeight: 600 }}>Mentees</span>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="Search user..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1 }}
        />
        <select
          value=""
          onChange={(e) => {
            const id = e.target.value;
            if (!id) return;
            onChange([...menteeIds, id]);
            setQuery("");
          }}
        >
          <option value="">Add...</option>
          {filtered.map((u) => (
            <option key={u.id} value={u.id}>
              {u.displayName || u.spiritualName || u.email}
            </option>
          ))}
        </select>
      </div>
      {menteeIds.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {menteeIds.map((id) => {
            const u = users.find((x) => x.id === id);
            return (
              <li
                key={id}
                style={{
                  background: "#eef",
                  padding: "4px 8px",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                }}
              >
                <span>{u ? u.displayName || u.spiritualName || u.email : id}</span>
                <button
                  type="button"
                  style={{ background: "transparent", border: "none", cursor: "pointer" }}
                  onClick={() => onChange(menteeIds.filter((x) => x !== id))}
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
