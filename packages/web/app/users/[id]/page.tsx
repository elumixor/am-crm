"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../../components/AuthContext";
import Link from "next/link";
import { EntityChip } from "../../../components/EntityChip";

interface UserDto {
  id: string;
  email: string;
  displayName: string | null;
  spiritualName: string | null;
  fullName: string | null;
  telegramHandle: string | null;
  whatsapp: string | null;
  photoUrl: string | null;
  unitId: string | null;
  mentorId: string | null;
  menteeIds: string[];
}

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!apiBase) throw new Error("API_BASE_URL is not defined");

export default function UserProfileView() {
  const params = useParams();
  const id = params?.id as string;

  const [user, setUser] = useState<UserDto | null>(null);
  const [allUsers, setAllUsers] = useState<UserDto[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${apiBase}/users/${id}`);
      if (res.ok) setUser(await res.json());
      const all = await fetch(`${apiBase}/users`)
        .then((r) => r.json())
        .catch(() => []);
      setAllUsers(all);
    })();
  }, [id]);

  if (!user) return <main style={{ padding: 24 }}>Loading...</main>;

  const mentor = user.mentorId ? allUsers.find((u) => u.id === user.mentorId) : null;
  const mentees = user.menteeIds.map((mid) => allUsers.find((u) => u.id === mid)).filter(Boolean) as UserDto[];

  return (
    <main style={{ fontFamily: "system-ui", padding: 24, maxWidth: 820 }}>
      <Link href="/users" style={{ color: "#0366d6", textDecoration: "none" }}>
        ← Back to users
      </Link>
      <h1 style={{ marginTop: 12 }}>{user.displayName || user.spiritualName || user.email}</h1>
      <p style={{ marginTop: -8, color: "#666" }}>{user.email}</p>
      <section style={{ display: "grid", gap: 12, maxWidth: 500 }}>
        <Field label="Display Name" value={user.displayName || ""} />
        <Field label="Spiritual Name" value={user.spiritualName || ""} />
        <Field label="Full Name" value={user.fullName || ""} />
        <div style={{ display: "grid", gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>Mentor</span>
          {mentor ? (
            <EntityChip
              id={mentor.id}
              type="user"
              name={mentor.displayName || mentor.spiritualName || mentor.email}
              href={`/users/${mentor.id}`}
              photoUrl={mentor.photoUrl || undefined}
            />
          ) : (
            <span style={{ color: "#555" }}>—</span>
          )}
        </div>
        <div style={{ display: "grid", gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>Mentees</span>
          {mentees.length === 0 ? (
            <span style={{ color: "#555" }}>None</span>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {mentees.map((m) => (
                <EntityChip
                  key={m.id}
                  id={m.id}
                  type="user"
                  name={m.displayName || m.spiritualName || m.email}
                  href={`/users/${m.id}`}
                  photoUrl={m.photoUrl || undefined}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  const id = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <label htmlFor={id} style={{ fontSize: 12, fontWeight: 600 }}>
        {label}
      </label>
      {<span style={{ padding: "4px 0" }}>{value || "—"}</span>}
    </div>
  );
}
