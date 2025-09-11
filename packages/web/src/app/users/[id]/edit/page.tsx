"use client";

import type { UserUpdateInput } from "@am-crm/shared";
import { Button } from "components/shad/button";
import { useAuth } from "contexts/AuthContext";
import { useRetrieved } from "lib/hooks/use-retrieved";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { HashLoader } from "react-spinners";
import { validJson } from "services/http";
import { UserEditForm } from "./UserEditForm";

export default function UserEditPage() {
  const { userId: currentUserId, loaded, client } = useAuth();
  const params = useParams();
  const router = useRouter();

  const userId = params.id as string;

  // Create fetch function for users
  const fetchUser = React.useCallback(
    async (id: string): Promise<(UserUpdateInput & { id: string }) | null> => {
      const userData = await validJson(client.users[":id"].$get({ param: { id } }));
      return { ...userData, id }; // Ensure id is included
    },
    [client],
  );

  const { retrievedObj: user, isLoading, setId } = useRetrieved<UserUpdateInput & { id: string }>(fetchUser);

  // Set the ID when component mounts
  React.useEffect(() => {
    if (userId) setId(userId);
  }, [userId, setId]);

  // Show loader while auth state is loading
  if (!loaded)
    return (
      <main className="container mx-auto px-4 py-8 flex justify-center items-center h-[60vh]">
        <HashLoader />
      </main>
    );

  // Only allow editing own profile
  if (userId !== currentUserId) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">You can only edit your own profile.</p>
          <Button variant="outline" className="mt-4" onClick={() => router.back()}>
            ← Go Back
          </Button>
        </div>
      </main>
    );
  }

  // Show loading spinner if object is not yet loaded or if the id is undefined/null
  if (isLoading || !user) {
    return (
      <main className="container mx-auto px-4 py-8 flex justify-center items-center h-[60vh]">
        <HashLoader />
      </main>
    );
  }

  const handleUpdate = (updatedUser: UserUpdateInput) => {
    // Handle user update if needed
    console.log("User updated:", updatedUser);
  };

  return <UserEditForm user={user} onUpdate={handleUpdate} />;
}
