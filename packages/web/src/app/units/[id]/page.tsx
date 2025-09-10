"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { client, validJson } from "services/http";
import ui from "./styles.module.scss";
import { z } from "zod";

interface UnitDetail {
  id: string;
  name: string;
  description: string;
  users: { id: string }[]; // from detail endpoint
}

const updateUnitSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    userIds: z.array(z.string()),
  })
  .optional();

export default function UnitProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [unit, setUnit] = useState<UnitDetail | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      const response = await client.units[":id"].$get({ param: { id } });
      setUnit(await validJson(response));
    })();
  }, [id]);

  function update<K extends keyof UnitDetail>(key: K, value: UnitDetail[K]) {
    setUnit((u) => (u ? { ...u, [key]: value } : u));
  }

  async function save() {
    if (!unit) return;
    setSaving(true);
    const payload = { name: unit.name, description: unit.description, userIds: unit.users.map((u) => u.id) };
    updateUnitSchema.parse(payload);

    await client.units[":id"].$put({ param: { id: unit.id }, json: payload });
    setSaving(false);
    router.refresh();
  }

  if (!unit) return <main className={ui.main}>Loading...</main>;

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
        {/* <ChipsSelector
          label="Users"
          selectedIds={unit.userIds}
          items={userItems.map((u) => ({ ...u, href: `/users/${u.id}` }))}
          onChange={(ids) => update("userIds", ids)}
          placeholder="Search users..."
        /> */}
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
