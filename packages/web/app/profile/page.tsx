"use client";
import { ChipsSelector } from "components/ChipsSelector";
import { EntityChip } from "components/EntityChip";
import { useAuth } from "contexts/AuthContext";
import type { InferResponseType } from "hono/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from "services/http";
import ui from "styles/ui.module.scss";
import { z } from "zod";

const updateProfileSchema = z.object({
  email: z.email(),
  fullName: z.string().nullable(),
  spiritualName: z.string().nullable(),
  displayName: z.string().nullable(),
  telegram: z.string().nullable(),
  whatsapp: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  nationality: z.string().nullable(),
  languages: z.string().nullable(),
  location: z.string().nullable(),
  preferredLanguage: z.string().nullable(),
  unitId: z.string().nullable().optional(),
  mentorId: z.string().nullable(),
  acaryaId: z.string().nullable(),
  lessons: z.any().optional(),
});

// type User = z.infer<typeof updateProfileSchema> & { id: string };
type User = InferResponseType<(typeof client.users)[":id"]["$get"]>;
type Unit = InferResponseType<(typeof client.units)[":id"]["$get"]>;

const fieldDefs: { key: keyof User; label: string; type?: string; readOnly?: boolean }[] = [
  { key: "email", label: "Email", readOnly: true },
  { key: "fullName", label: "Full Name" },
  { key: "spiritualName", label: "Spiritual Name" },
  { key: "displayName", label: "Display Name" },
  { key: "telegram", label: "Telegram" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "dateOfBirth", label: "Date of Birth", type: "date" },
  { key: "nationality", label: "Nationality" },
  { key: "languages", label: "Languages" },
  { key: "location", label: "Location" },
  { key: "preferredLanguage", label: "Preferred Language" },
];

export default function ProfilePage() {
  const { token, header, userId, logout } = useAuth();

  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false); // NEW
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    // Redirect if not logged in
    if (!token) {
      router.replace("/login");
      return;
    }

    // Load profile
    (async () => {
      const res = await client.me.$get({ header });

      if (res.status === 401) {
        // Session expired or backend has no session for this token
        localStorage.removeItem("session");
        router.replace("/login");
        return;
      }

      if (res.ok) setUser(await res.json());

      const unitsRes = await client.units.$get({ header });
      if (unitsRes.ok) setUnits((await unitsRes.json()).data);

      const response = await client.users.$get({ header });
      const { data } = await response.json();
      setUsers(data);
    })();
  }, [token, router, header]);

  if (!token) return null;

  function updateField<K extends keyof User>(key: K, value: User[K]) {
    setUser((u: User | null) => (u ? { ...u, [key]: value } : u));
  }

  async function uploadPhoto(file: File) {
    if (!token) return;
    setUploadingPhoto(true);
    try {
      const url = await client.me.photo.$post({ form: { photo: file } });
      if (!url) return;

      setUser((u: User) => (u ? { ...u, photoUrl: url } : u));
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function save() {
    if (!userId || !user || !header) return;
    setSaving(true);
    const body: Partial<User> = { ...user };
    updateProfileSchema.parse(body);
    await client.users[":id"].$put({ param: { id: user.id }, json: body });
    // await httpPut(`/me/mentees`, { menteeIds: user.menteeIds }, { headers: { authorization: `Bearer ${token}` } });
    setSaving(false);
  }

  async function deleteAccount() {
    if (!userId) return;
    // Using admin endpoint for now (MVP) – in future provide /me DELETE with auth.
    // await httpDel(`/users/${userId}`);
    logout();
    router.replace("/register");
  }

  return (
    <main className={`${ui.container} ${ui.main} ${ui.max800}`}>
      <h1>My Profile</h1>
      {user ? (
        <div className={ui.gridGap24}>
          <section className={ui.flexRowGap24}>
            <div>
              <div
                className={`${ui.avatar} ${ui.avatarLg}`}
                style={{ backgroundImage: user.photoUrl ? `url(${user.photoUrl})` : "url(/images/user.png)" }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadPhoto(file);
                }}
                className={ui.mt8}
              />
              {uploadingPhoto && <div className={`${ui.text12} ${ui.textMuted} ${ui.mt4}`}>Uploading...</div>}
            </div>
            <div className={ui.gridGap12} style={{ flex: 1 }}>
              {fieldDefs.map((f) => (
                <label key={f.key as string} className={ui.gridGap4}>
                  <span className={ui.labelSm}>{f.label}</span>
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
              <label className={ui.gridGap4}>
                <span className={ui.labelSm}>Unit</span>
                <select value={user.unitId || ""} onChange={(e) => updateField("unitId", e.target.value || null)}>
                  <option value="">-- none --</option>
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </label>
              {user.unitId ? (
                <EntityChip
                  id={user.unitId}
                  type="unit"
                  name={units.find((u) => u.id === user.unitId)?.name || ""}
                  href={`/units/${user.unitId}`}
                  onRemove={() => updateField("unitId", null)}
                />
              ) : undefined}
              <label className={ui.gridGap4}>
                <span className={ui.labelSm}>Mentor</span>
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
              {user.mentorId ? (
                <EntityChip
                  id={user.mentorId}
                  type="user"
                  href={`/users/${user.mentorId}`}
                  name={(() => {
                    const mentorUser = users.find((u) => u.id === user.mentorId);
                    return mentorUser?.displayName ?? mentorUser?.email ?? mentorUser?.id ?? "";
                  })()}
                  onRemove={() => updateField("mentorId", null)}
                />
              ) : undefined}
              <div className={ui.gridGap4}>
                <span className={ui.labelSm}>Mentees</span>
                <ChipsSelector
                  selectedIds={user.menteeIds}
                  items={users
                    .filter((u) => u.id !== user.id)
                    .map((u) => ({
                      id: u.id,
                      label: u.displayName || u.spiritualName || u.email,
                      href: `/users/${u.id}`,
                    }))}
                  onChange={(ids) => updateField("menteeIds", ids)}
                />
              </div>
              <div className={ui.flexRowGap12}>
                <button type="button" onClick={save} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button type="button" onClick={logout}>
                  Logout
                </button>
                <button type="button" onClick={() => setConfirmDelete(true)} className={`${ui.mAuto} ${ui.textDanger}`}>
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
        <div className={ui.overlay}>
          <div className={ui.modal}>
            <h3 className={ui.mt0}>Confirm Deletion</h3>
            <p className={ui.text14}>
              This will permanently delete your account. This action cannot be undone. Proceed?
            </p>
            <div className={`${ui.flexRowGap12} ${ui.justifyEnd}`}>
              <button type="button" onClick={() => setConfirmDelete(false)}>
                Cancel
              </button>
              <button type="button" onClick={deleteAccount} className={`${ui.btn} ${ui.btnDanger}`}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// (MenteesSelector replaced with generic ChipsSelector)
