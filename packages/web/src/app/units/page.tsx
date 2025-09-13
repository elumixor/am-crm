"use client";
import type { Unit } from "@am-crm/db";
import { Button } from "components/shad/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/shad/card";
import { Input } from "components/shad/input";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { client, validJsonInternal } from "services/http";
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
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Units</h1>

        <Card>
          <CardHeader>
            <CardTitle>Create New Unit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="New unit name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={createUnit} disabled={!newName.trim()}>
                Add Unit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      ) : units.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <p className="text-muted-foreground">No units yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {units.map((unit) => (
            <Card key={unit.id} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      <a href={`/units/${unit.id}`} className="text-primary hover:underline">
                        {unit.name}
                      </a>
                    </h3>
                    <p className="text-sm text-muted-foreground">{unit.description || "No description"}</p>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Users: <span className="font-medium">{"fix me"}</span>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="destructive" size="sm" onClick={() => remove(unit.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
