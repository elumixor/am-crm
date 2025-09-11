"use client";

import { Avatar, AvatarFallback, AvatarImage } from "components/shad/avatar";
import { Button } from "components/shad/button";
import { useAuth } from "contexts/AuthContext";
import { useSignedUrl } from "lib";
import Link from "next/link";
import { useEffect, useState } from "react";
import { client, validJsonInternal } from "services/http";

export default function UserSection() {
  const { userId, loaded } = useAuth();
  const [user, setUser] = useState<{ id: string; photoKey: string | null } | null>(null);
  const [userProfilePictureUrl, setKey] = useSignedUrl({ defaultUrl: "/images/user.png" });

  useEffect(() => {
    if (userId) {
      void (async () => {
        const res = await client.users[":id"].$get({ param: { id: userId } });
        const { id, photoKey } = await validJsonInternal(res);
        setUser({ id, photoKey });
        setKey(photoKey ?? undefined);
      })();
    } else setUser(null);
  }, [userId]);

  // Hide everything if not loaded yet
  if (!loaded) return;

  // Show default sign in/up buttons until auth is resolved
  if (!userId) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/login">Sign In</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Sign Up</Link>
        </Button>
      </div>
    );
  }

  // User is authenticated but profile is loading
  if (!user) return;

  // Fully loaded
  return (
    <Link href={`/users/${userId}`}>
      <Avatar>
        <AvatarImage src={userProfilePictureUrl} alt="Profile picture" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </Link>
  );
}
