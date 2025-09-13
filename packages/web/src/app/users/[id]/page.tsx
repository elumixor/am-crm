"use client";

import type { User } from "@am-crm/shared";
import { Avatar, AvatarFallback, AvatarImage } from "components/shad/avatar";
import { Badge } from "components/shad/badge";
import { Button } from "components/shad/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/shad/card";
import { useAuth } from "contexts/AuthContext";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { client, validJson } from "services/http";
import { getUserDisplayName } from "utils/user";

function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <Button variant="destructive" onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default function UserProfileView() {
  const params = useParams();
  const id = params?.id as string;
  const { userId } = useAuth();
  const router = useRouter();

  const [user] = useState<User | null>(null);
  const [allUsers] = useState<User[]>([]);

  useEffect(() => {
    void (async () => {
      await validJson(client.users[":id"].$get({ param: { id } }));
      // TODO: Uncomment when backend is ready
      // if (user) setUser(user);
      // const allRes = await validJson(client.users.$get());
      // setAllUsers(allRes.data);
    })();
  }, [id]);

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </main>
    );
  }

  const mentor = user.mentorId ? allUsers.find((u) => u.id === user.mentorId) : null;
  const mentees = (user.menteeIds ?? []).map(id => allUsers.find(u => u.id === id)).filter(Boolean) as User[];
  const isOwnProfile = userId === id;
  const displayName = getUserDisplayName(user);

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          ← Back
        </Button>
        {isOwnProfile && (
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/users/${id}/edit`}>Edit Profile</Link>
            </Button>
            <LogoutButton />
          </div>
        )}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.photoUrl || undefined} alt={displayName} />
              <AvatarFallback className="text-2xl">{displayName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{displayName}</CardTitle>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Field label="Display Name" value={user.displayName} />
              <Field label="Spiritual Name" value={user.spiritualName} />
              <Field label="Worldly Name" value={user.worldlyName} />
            </div>

            <div className="space-y-4">
              <Field label="Telegram" value={user.telegram} />
              <Field label="WhatsApp" value={user.whatsapp} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Mentor</span>
              <div className="mt-2">
                {mentor ? (
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={mentor.photoUrl ?? undefined} alt={getUserDisplayName(mentor)} />
                      <AvatarFallback>{getUserDisplayName(mentor).charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Link href={`/users/${mentor.id}`} className="text-primary hover:underline">
                      {getUserDisplayName(mentor)}
                    </Link>
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-sm font-medium text-muted-foreground">Mentees</span>
              <div className="mt-2">
                {mentees.length === 0 ? (
                  <span className="text-muted-foreground">None</span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {mentees.map((mentee) => (
                      <Link key={mentee.id} href={`/users/${mentee.id}`}>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                          {getUserDisplayName(mentee)}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

const Field = ({ label, value }: { label: string; value: string | null }) => (
  <div>
    <span className="text-sm font-medium text-muted-foreground">{label}</span>
    <p className="mt-1">{value ?? "—"}</p>
  </div>
);
