"use client";
import { Button } from "components/shad/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/shad/card";
import { Input } from "components/shad/input";
import { Textarea } from "components/shad/textarea";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

interface UnitDetail {
  id: string;
  name: string;
  description: string | null;
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
      // const unit = await validJson(client.units[":id"].$get({ param: { id } }));
      // setUnit(unit);
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

    // await client.units[":id"].$put({ param: { id: unit.id }, json: payload });
    setSaving(false);
    router.refresh();
  }

  if (!unit) {
    return (
      <main className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </main>
    );
  }

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
            <Input value={unit.name} onChange={(e) => update("name", e.target.value)} placeholder="Unit name" />
          </div>

          <div>
            <span className="text-sm font-medium text-muted-foreground mb-2 block">Description</span>
            <Textarea
              value={unit.description || ""}
              onChange={(e) => update("description", e.target.value || null)}
              rows={3}
              placeholder="Unit description"
            />
          </div>

          {/* TODO: Add ChipsSelector component for users when available */}
          <div>
            <span className="text-sm font-medium text-muted-foreground mb-2 block">Users</span>
            <p className="text-sm text-muted-foreground">
              {unit.users.length} user{unit.users.length !== 1 ? "s" : ""} assigned
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" onClick={() => router.push("/units")}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
