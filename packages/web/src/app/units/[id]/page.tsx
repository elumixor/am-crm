"use client";
import type { Unit } from "@am-crm/db";
import { Button } from "components/shad/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/shad/card";
import { Input } from "components/shad/input";
import { Textarea } from "components/shad/textarea";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "contexts/AuthContext";
import { client, validJson } from "services/http";
import { z } from "zod";

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

interface UnitWithUsers extends Unit {
  users: UnitUser[]; // from detail endpoint
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

const updateUnitSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  userIds: z.array(z.string()),
});

export default function UnitProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { userId } = useAuth();
  const id = params?.id as string;
  const [unit, setUnit] = useState<UnitWithUsers | null>(null);
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

  function update<K extends keyof UnitWithUsers>(key: K, value: UnitWithUsers[K]) {
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

  if (!unit) {
    return (
      <main className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </main>
    );
  }

  // Filter available users to only show those not already in the unit
  const usersToAdd = availableUsers.filter(user => !unit.users.some(u => u.id === user.id));

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/units">← Back to units</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Unit: {unit.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <span className="text-sm font-medium text-muted-foreground mb-2 block">Name</span>
            <Input 
              value={unit.name} 
              onChange={(e) => update("name", e.target.value)} 
              placeholder="Unit name"
              disabled={!canManageUnit}
            />
          </div>

          <div>
            <span className="text-sm font-medium text-muted-foreground mb-2 block">Description</span>
            <Textarea
              value={unit.description ?? ""}
              onChange={(e) => update("description", e.target.value || null)}
              rows={3}
              placeholder="Unit description"
              disabled={!canManageUnit}
            />
          </div>

          {/* Unit Members Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Members ({unit.users.length})</span>
              {canManageUnit && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAddUser(true)}
                >
                  Add Member
                </Button>
              )}
            </div>
            
            {unit.users.length === 0 ? (
              <p className="text-sm text-muted-foreground">No members yet.</p>
            ) : (
              <div className="space-y-2">
                {unit.users.map((user) => (
                  <Card key={user.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{getUserDisplayName(user)}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                        {user.telegram && (
                          <div className="text-xs text-muted-foreground">Telegram: {user.telegram}</div>
                        )}
                      </div>
                      {canManageUnit && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeUserFromUnit(user.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Add User Modal/Section */}
          {showAddUser && canManageUnit && (
            <Card className="border-dashed">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Add User to Unit</CardTitle>
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowAddUser(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {usersToAdd.length === 0 ? (
                    <p className="text-sm text-muted-foreground">All users are already members of this unit.</p>
                  ) : (
                    usersToAdd.map((user) => (
                      <Card key={user.id} className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-sm">{getUserDisplayName(user)}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addUserToUnit(user)}
                          >
                            Add
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {canManageUnit && (
            <div className="flex gap-4 pt-4">
              <Button onClick={save} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={() => router.push("/units")}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
