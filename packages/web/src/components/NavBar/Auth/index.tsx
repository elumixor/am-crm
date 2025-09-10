"use client";

import { useAuth } from "contexts/AuthContext";
import { useSignedUrl } from "lib";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { client, validJson } from "services/http";
import styles from "./style.module.scss";

export default function AuthSection() {
  const { userId, loaded } = useAuth();
  const [user, setUser] = useState<{ id: string; photoKey: string | null } | null>(null);
  const [userProfilePictureUrl, setKey] = useSignedUrl({ defaultUrl: "/images/user.png" });

  useEffect(() => {
    console.log(`Loaded? ${loaded}, userId: ${userId}`);
  }, []);

  useCallback(() => {
    console.log(`Loaded? ${loaded}, userId: ${userId}`);
  }, [userId, loaded]);

  useEffect(() => {
    if (userId) {
      void (async () => {
        const res = await client.users[":id"].$get({ param: { id: userId } });
        const { id, photoKey } = await validJson(res);
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
      <div className="flex-center gap-sm">
        <Link href="/login" className="button primary unstyled">
          Sign In
        </Link>
        <Link href="/register" className="button unstyled">
          Sign Up
        </Link>
      </div>
    );
  }

  // User is authenticated but profile is loading
  if (!user) return;

  // Fully loaded
  return (
    <Link href={`/users/${userId}`} className={styles.profileLink}>
      <button
        type="button"
        className="icon-md round"
        style={{ backgroundImage: `url(${userProfilePictureUrl})`, backgroundSize: "cover" }}
        aria-label="Change profile picture"
      ></button>
    </Link>
  );
}
