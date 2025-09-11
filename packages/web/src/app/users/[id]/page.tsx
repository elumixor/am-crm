"use client";

import { EntityChip } from "components/EntityChip";
import { useAuth } from "contexts/AuthContext";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from "services/http";
import ui from "./styles.module.scss";

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
  mentees: { id: string }[];
}

function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        logout();
        router.push("/login");
      }}
      className={`${ui.btn} ${ui.btnDanger}`}
    >
      Logout
    </button>
  );
}

export default function UserProfileView() {
  const params = useParams();
  const id = params?.id as string;
  const { userId } = useAuth();
  const router = useRouter();

  const [user, setUser] = useState<UserDto | null>(null);
  const [allUsers, setAllUsers] = useState<UserDto[]>([]);

  useEffect(() => {
    void (async () => {
      const res = await client.users[":id"].$get({ param: { id } });
      if (res.ok) setUser(await res.json());
      const allRes = await (await client.users.$get()).json();
      setAllUsers(allRes.data);
    })();
  }, [id]);

  if (!user) return <main className={ui.main}>Loading...</main>;

  const mentor = user.mentorId ? allUsers.find((u) => u.id === user.mentorId) : null;
  const mentees = user.mentees.map(({ id }) => allUsers.find((u) => u.id === id)).filter(Boolean) as UserDto[];
  const isOwnProfile = userId === id;

  return (
    <main className={`${ui.container} ${ui.main} ${ui.max820}`}>
      <button type="button" onClick={() => router.back()} className={ui.link}>
        ← Back
      </button>
      {isOwnProfile && (
        <div style={{ float: "right", display: "flex", gap: "8px" }}>
          <Link href={`/users/${id}/edit`}>
            <button type="button" className={`${ui.btn} ${ui.btnPrimary}`}>
              Edit
            </button>
          </Link>
          <LogoutButton />
        </div>
      )}
      <h1 className={ui.mt12}>{user.displayName || user.spiritualName || user.email}</h1>
      <p className={`${ui.mtNeg8} ${ui.textMuted}`}>{user.email}</p>
      <section className={ui.gridGap12} style={{ maxWidth: 500 }}>
        <Field label="Display Name" value={user.displayName || ""} />
        <Field label="Spiritual Name" value={user.spiritualName || ""} />
        <Field label="Full Name" value={user.fullName || ""} />
        <div className={ui.gridGap4}>
          <span className={ui.labelSm}>Mentor</span>
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
        <div className={ui.gridGap4}>
          <span className={ui.labelSm}>Mentees</span>
          {mentees.length === 0 ? (
            <span style={{ color: "#555" }}>None</span>
          ) : (
            <div className={ui.flexWrapGap8}>
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
    <div className={ui.gridGap4}>
      <label htmlFor={id} className={ui.labelSm}>
        {label}
      </label>
      {<span className={ui.py4}>{value || "—"}</span>}
    </div>
  );
}
