"use client";
import { ChipsSelector } from "components/ChipsSelector";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from "services/http";
import ui from "styles/ui.module.scss";
import { z } from "zod";

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
  description: string;
  userIds: string[];
  users?: User[]; // from detail endpoint
}

const updateUnitSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  userIds: z.array(z.string()),
});

export default function UnitProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [unit, setUnit] = useState<UnitDetail | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await client.units[":id"].$get({ param: { id } });
      if (res.ok) setUnit(await res.json());

      const usersRes = await (await client.users.$get()).json();
      if (usersRes.ok) setAllUsers(usersRes.data);
    })();
  }, [id]);

  function update<K extends keyof UnitDetail>(key: K, value: UnitDetail[K]) {
    setUnit((u) => (u ? { ...u, [key]: value } : u));
  }

  async function save() {
    if (!unit) return;
    setSaving(true);
    const payload = { name: unit.name, description: unit.description, userIds: unit.userIds };
    updateUnitSchema.parse(payload);

    await client.units[":id"].$put({ param: { id: unit.id }, json: payload });
    setSaving(false);
    router.refresh();
  }

  if (!unit) return <main className={ui.main}>Loading...</main>;

  const userItems = allUsers.map((u) => ({
    id: u.id,
    label: u.displayName || u.spiritualName || u.fullName || u.email,
  }));

  return (
    <main className={`${ui.container} ${ui.main} ${ui.max800}`}>
      <a href="/units" className={ui.link}>
        ← Back to units
      </a>
      <h1 className={ui.mt12}>Unit: {unit.name}</h1>
      <div className={ui.gridGap16}>
        <label className={ui.gridGap4}>
          <span className={ui.labelSm}>Name</span>
          <input value={unit.name} onChange={(e) => update("name", e.target.value)} />
        </label>
        <label className={ui.gridGap4}>
          <span className={ui.labelSm}>Description</span>
          <textarea
            value={unit.description || ""}
            onChange={(e) => update("description", e.target.value ?? null)}
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
        <div className={ui.flexRowGap12}>
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
