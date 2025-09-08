"use client";
import { useAuth } from "contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  // const { userId } = useAuth();
  // const router = useRouter();

  // useEffect(() => {
  //   if (userId) {
  //     router.replace(`/users/${userId}`);
  //   }
  // }, [userId, router]);

  return <div>Redirecting...</div>;
}
