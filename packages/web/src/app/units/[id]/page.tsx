"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "contexts/AuthContext";
import { client, validJson } from "services/http";
import { z } from "zod";
import ui from "./styles.module.scss";

interface UnitUser {
  id: string;
  email: string;
  spiritualName: string | null;
  worldlyName: string | null;
  preferredName: string | null;
  preferredNameType: "spiritual" | "worldly" | "custom";
  displayName: string | null;
  telegram: string | null;
  whatsapp: string | null;
}

interface UnitDetail {
  id: string;
  name: string;
  description: string | null;
  users: UnitUser[];
}

function getUserDisplayName(user: UnitUser): string {
  if (user.displayName) return user.displayName;
  if (user.preferredName) return user.preferredName;
  
  switch (user.preferredNameType) {
    case "spiritual":
      return user.spiritualName || user.worldlyName || user.email;
    case "worldly":
      return user.worldlyName || user.spiritualName || user.email;
    case "custom":
      return user.preferredName || user.spiritualName || user.worldlyName || user.email;
    default:
      return user.spiritualName || user.worldlyName || user.email;
  }
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
  const { userId } = useAuth();
  const id = params?.id as string;
  const [unit, setUnit] = useState<UnitDetail | null>(null);
  const [saving, setSaving] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<UnitUser[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);

  // Simple permission check - authenticated users can manage units
  // TODO: Implement proper role-based permissions (unit secretary, admin, etc.)
  const canManageUnit = !!userId;

  useEffect(() => {
    void (async () => {
      try {
        const unit = await validJson(client.units[":id"].$get({ param: { id } }));
        setUnit(unit);
      } catch (error) {
        console.error("Failed to load unit:", error);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (canManageUnit && showAddUser) {
      void (async () => {
        try {
          const response = await validJson(client.users.$get());
          setAvailableUsers(response.data);
        } catch (error) {
          console.error("Failed to load users:", error);
        }
      })();
    }
  }, [canManageUnit, showAddUser]);

  function update<K extends keyof UnitDetail>(key: K, value: UnitDetail[K]) {
    setUnit((u) => (u ? { ...u, [key]: value } : u));
  }

  function addUserToUnit(user: UnitUser) {
    if (!unit) return;
    const isAlreadyMember = unit.users.some(u => u.id === user.id);
    if (!isAlreadyMember) {
      update("users", [...unit.users, user]);
    }
    setShowAddUser(false);
  }

  function removeUserFromUnit(userId: string) {
    if (!unit) return;
    update("users", unit.users.filter(u => u.id !== userId));
  }

  async function save() {
    if (!unit) return;
    setSaving(true);
    try {
      const payload = { name: unit.name, description: unit.description, userIds: unit.users.map((u) => u.id) };
      updateUnitSchema.parse(payload);

      await client.units[":id"].$put({ param: { id: unit.id }, json: payload });
      setSaving(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to save unit:", error);
      setSaving(false);
    }
  }

  if (!unit) return <main className={ui.main}>Loading...</main>;

  // Filter available users to only show those not already in the unit
  const usersToAdd = availableUsers.filter(user => !unit.users.some(u => u.id === user.id));

  return (
    <main className={`${ui.container} ${ui.main} ${ui.max800}`}>
      <a href="/units" className={ui.link}>
        ← Back to units
      </a>
      <h1 className={ui.mt12}>Unit: {unit.name}</h1>
      <div className={ui.gridGap16}>
        <label className={ui.gridGap4}>
          <span className={ui.labelSm}>Name</span>
          <input 
            value={unit.name} 
            onChange={(e) => update("name", e.target.value)}
            disabled={!canManageUnit}
          />
        </label>
        <label className={ui.gridGap4}>
          <span className={ui.labelSm}>Description</span>
          <textarea
            value={unit.description || ""}
            onChange={(e) => update("description", e.target.value ?? null)}
            rows={3}
            disabled={!canManageUnit}
          />
        </label>

        {/* Unit Members Section */}
        <div className={ui.gridGap4}>
          <div className={ui.flexRowGap8}>
            <span className={ui.labelSm}>Members ({unit.users.length})</span>
            {canManageUnit && (
              <button 
                type="button" 
                onClick={() => setShowAddUser(true)}
                className={ui.textPrimary}
              >
                + Add Member
              </button>
            )}
          </div>
          
          {unit.users.length === 0 ? (
            <p className={ui.textMuted}>No members yet.</p>
          ) : (
            <div className={ui.gridGap8}>
              {unit.users.map((user) => (
                <div key={user.id} className={`${ui.flexRow} ${ui.p12} ${ui.border} ${ui.rounded}`}>
                  <div className={ui.flex1}>
                    <div className={ui.fontSemibold}>{getUserDisplayName(user)}</div>
                    <div className={ui.textSm}>{user.email}</div>
                    {user.telegram && (
                      <div className={ui.textSm}>Telegram: {user.telegram}</div>
                    )}
                  </div>
                  {canManageUnit && (
                    <button
                      type="button"
                      onClick={() => removeUserFromUnit(user.id)}
                      className={ui.textDanger}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add User Modal/Dropdown */}
        {showAddUser && canManageUnit && (
          <div className={`${ui.gridGap8} ${ui.p12} ${ui.border} ${ui.rounded}`}>
            <div className={ui.flexRowGap8}>
              <span className={ui.labelSm}>Add User to Unit</span>
              <button
                type="button"
                onClick={() => setShowAddUser(false)}
                className={ui.textMuted}
              >
                Cancel
              </button>
            </div>
            <div className={ui.gridGap8}>
              {usersToAdd.length === 0 ? (
                <p className={ui.textMuted}>All users are already members of this unit.</p>
              ) : (
                usersToAdd.map((user) => (
                  <div key={user.id} className={`${ui.flexRow} ${ui.p8} ${ui.border} ${ui.rounded}`}>
                    <div className={ui.flex1}>
                      <div className={ui.fontSemibold}>{getUserDisplayName(user)}</div>
                      <div className={ui.textSm}>{user.email}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => addUserToUnit(user)}
                      className={ui.textPrimary}
                    >
                      Add
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {canManageUnit && (
          <div className={ui.flexRowGap12}>
            <button type="button" onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => router.push("/units")}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
