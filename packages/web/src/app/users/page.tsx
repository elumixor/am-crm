"use client";

import type { User } from "@am-crm/shared";
import { Avatar, AvatarFallback, AvatarImage } from "components/shad/avatar";
import { Badge } from "components/shad/badge";
import { Button } from "components/shad/button";
import { Card, CardContent } from "components/shad/card";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { client, validJsonInternal } from "services/http";

export default function UsersPage() {
  const [users] = useState<User[]>([]);
  const [units, setUnits] = useState<{ id: string; name: string }[]>([]);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    const response = await client.users.$get();
    await validJsonInternal(response);
    // TODO: Uncomment when backend is ready
    // const { data } = await validJsonInternal(response);
    // setUsers(data);
  }, []);

  // Fetch units
  const fetchUnits = useCallback(async () => {
    const response = await client.units.$get();
    const { data } = await response.json();
    setUnits(data);
  }, []);

  // Handle delete
  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.email}?`)) return;

    await client.users[":id"].$delete({ param: { id: user.id } });
    await fetchUsers();
  };

  useEffect(() => {
    void fetchUsers();
    void fetchUnits();
  }, [fetchUsers, fetchUnits]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      {/* Users Grid */}
      {users.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <p className="text-muted-foreground">No users found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => {
            const unit = units.find((u) => u.id === user.unitId);
            const display = user.displayName || user.spiritualName || user.worldlyName || user.email;
            const mentor = user.mentorId ? users.find((u) => u.id === user.mentorId) : null;

            return (
              <Card key={user.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.photoUrl || undefined} alt={display} />
                      <AvatarFallback>{display.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/users/${user.id}`}
                        className="text-lg font-semibold hover:text-primary transition-colors"
                      >
                        {display}
                      </Link>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {unit && (
                          <Badge variant="secondary" className="text-xs">
                            Unit: {unit.name}
                          </Badge>
                        )}

                        {mentor && (
                          <Badge variant="outline" className="text-xs">
                            Mentor: {mentor.displayName || mentor.spiritualName || mentor.email}
                          </Badge>
                        )}

                        {user.menteeIds && user.menteeIds.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {user.menteeIds.length} Mentee{user.menteeIds.length !== 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/users/${user.id}`}>View</Link>
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(user)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
