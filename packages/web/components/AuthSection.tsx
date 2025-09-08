"use client";

import { useAuth } from "contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { client } from "services/http";
import styles from "./AuthSection.module.scss";

interface UserDto {
  id: string;
  photoUrl: string | null;
}

export default function AuthSection() {
  const { token, userId, loading } = useAuth();
  const [user, setUser] = useState<UserDto | null>(null);
  const [mounted, setMounted] = useState(false);

  // Track when component has mounted to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Don't fetch until mounted

    if (token && userId) {
      (async () => {
        const res = await client.users[":id"].$get({ param: { id: userId } });
        if (res.ok) {
          const userData = await res.json();
          setUser({ id: userData.id, photoUrl: userData.photoUrl });
        }
      })();
    } else {
      setUser(null);
    }
  }, [token, userId, mounted]);

  // Show default sign in/up buttons until component is mounted and auth is resolved
  if (!mounted || loading) {
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

  // User is not authenticated
  if (!token) {
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
        <Image
          src={user.photoUrl || "/images/user.png"}
          alt="Profile"
          width={32}
          height={32}
          className={styles.profileImage}
        />
      </Link>
    </div>
  );
}
