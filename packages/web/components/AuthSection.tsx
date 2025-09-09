"use client";

import { useAuth } from "contexts/AuthContext";
import { useSignedUrl } from "lib/signed-url";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { client, validJson } from "services/http";
import styles from "./AuthSection.module.scss";

export default function AuthSection() {
  const { userId, loaded } = useAuth();
  const [user, setUser] = useState<{ id: string; photoKey: string | null } | null>(null);
  const [userProfilePictureUrl, setKey] = useSignedUrl({ defaultUrl: "/images/user.png" });

  useCallback(() => {
    console.log(userId);
  }, [userId]);

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
      <div className={styles.authSection}>
        <Link href="/login" className={styles.authButton}>
          Sign In
        </Link>
        <Link href="/register" className={styles.authButton}>
          Sign Up
        </Link>
      </div>
    );
  }

  // User is authenticated but profile is loading
  if (!user) {
    return (
      <div className={styles.authSection}>
        <div className={styles.loadingProfile}>Loading profile...</div>
      </div>
    );
  }

  // User is authenticated and profile is loaded
  return (
    <div className={styles.authSection}>
      <Link href={`/users/${userId}`} className={styles.profileLink}>
        <button
          type="button"
          className={styles.profilePicture}
          style={{ backgroundImage: `url(${userProfilePictureUrl})` }}
          aria-label="Change profile picture"
        ></button>
      </Link>
    </div>
  );
}
