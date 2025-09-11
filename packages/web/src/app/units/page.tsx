"use client";
import type { Unit } from "@am-crm/db";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { client, validJsonInternal } from "services/http";
import ui from "./styles.module.scss";
import { z } from "zod";

const createUnitSchema = z.object({ name: z.string().min(1), description: z.string().optional() });

export default function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const load = useCallback(async () => {
    setLoading(true);
    const response = await client.units.$get();
    // const { data } = await validJsonInternal(response);
    // setUnits(data);
    setLoading(false);
  }, []);

  // Load immediately
  useEffect(() => {
    void load();
  }, []);

  async function createUnit() {
    const payload = { name: newName.trim() };
    // Client-side validation mirrors API validator
    createUnitSchema.parse(payload);
    const res = await client.units.$post({ json: payload });
    if (res.ok) {
      const unit = (await res.json()) as Unit;
      router.push(`/units/${unit.id}`);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete unit?")) return;
    await client.units[":id"].$delete({ param: { id } });
    await load();
  }

  return (
    <main className={`${ui.container} ${ui.main} ${ui.max900}`}>
      <h1>Units</h1>
      <div className={`${ui.flexRowGap8} ${ui.mb24}`}>
        <input
          placeholder="New unit name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className={ui.flex1}
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
        <table className={ui.table}>
          <thead>
            <tr className={ui.tableHead}>
              <th className={ui.th}>Name</th>
              <th className={ui.th}>Description</th>
              <th className={ui.th}>Users</th>
              <th className={ui.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.id}>
                <td className={ui.td}>
                  <a href={`/units/${u.id}`} className={ui.link}>
                    {u.name}
                  </a>
                </td>
                <td className={ui.td}>{u.description || "-"}</td>
                <td className={ui.td}>{"fix me"}</td>
                <td className={ui.td}>
                  <button type="button" onClick={() => remove(u.id)} className={ui.textDanger}>
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
