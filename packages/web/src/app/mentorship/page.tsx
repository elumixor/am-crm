"use client";

import { useAuth } from "contexts/AuthContext";
import { useAsyncWithError } from "lib/hooks";
import { useCallback, useEffect, useState } from "react";
import { validJsonInternal } from "services/http";
import { Button } from "components/shad/button";
import { ChipsSelector } from "components/ChipsSelector";

interface User {
  id: string;
  email: string;
  spiritualName?: string | null;
  worldlyName?: string | null;
  displayName?: string | null;
  mentorId?: string | null;
  mentees?: { id: string }[];
  traits?: { id: string; trait: string }[];
}

export default function MentorshipPage() {
  const { client, userId } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user is a mentor
  const isMentor = currentUser?.traits?.some(trait => trait.trait === "mentor") ?? false;
  const hasMentor = currentUser?.mentorId != null;

  // Load current user and all users
  const loadData = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const [userResponse, usersResponse] = await Promise.all([
        client.users[":id"].$get({ param: { id: userId } }),
        client.users.$get()
      ]);
      
      const user = await validJsonInternal(userResponse);
      const { data: users } = await validJsonInternal(usersResponse);
      
      setCurrentUser(user);
      setAllUsers(users);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [client, userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Add mentor trait
  const [becomeMentor, becomeMentorError, becomeMentorLoading] = useAsyncWithError(async () => {
    if (!userId) return;
    
    const response = await client.users[":id"].traits.$post({ 
      param: { id: userId }, 
      json: { trait: "mentor" }
    });
    
    await validJsonInternal(response);
    await loadData();
  });

  // Remove mentor trait
  const [stopMentoring, stopMentoringError, stopMentoringLoading] = useAsyncWithError(async () => {
    if (!userId) return;
    
    const response = await client.users[":id"].traits[":trait"].$delete({ 
      param: { id: userId, trait: "mentor" }
    });
    
    await validJsonInternal(response);
    await loadData();
  });

  // Request a mentor (placeholder - would need actual implementation)
  const [requestMentor, requestMentorError, requestMentorLoading] = useAsyncWithError(async () => {
    // For now, just show an alert - in a real app this would create a request
    alert("Mentor request functionality would be implemented here");
  });

  // Update mentees
  const [updateMentees, updateMenteesError, updateMenteesLoading] = useAsyncWithError(async (menteeIds: string[]) => {
    if (!userId) return;
    
    const response = await client.mentees.$put({ 
      json: { menteeIds }
    });
    
    await validJsonInternal(response);
    await loadData();
  });

  if (loading) {
    return (
      <main>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Mentorship</h1>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Mentorship</h1>
          <p>User not found</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Mentorship</h1>
        
        <div className="grid gap-6">
          {/* Action Buttons Section */}
          <section className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            <div className="flex gap-4 flex-wrap">
              {!isMentor && !hasMentor && (
                <Button 
                  onClick={requestMentor}
                  disabled={requestMentorLoading}
                  variant="outline"
                >
                  {requestMentorLoading ? "Requesting..." : "Request a Mentor"}
                </Button>
              )}
              
              {!isMentor && (
                <Button 
                  onClick={becomeMentor}
                  disabled={becomeMentorLoading}
                >
                  {becomeMentorLoading ? "Processing..." : "Become a Mentor"}
                </Button>
              )}
              
              {isMentor && (
                <Button 
                  onClick={stopMentoring}
                  disabled={stopMentoringLoading}
                  variant="destructive"
                >
                  {stopMentoringLoading ? "Processing..." : "Stop Mentoring"}
                </Button>
              )}
            </div>
            
            {/* Error messages */}
            {becomeMentorError && <p className="text-red-600 mt-2">Error: {becomeMentorError}</p>}
            {stopMentoringError && <p className="text-red-600 mt-2">Error: {stopMentoringError}</p>}
            {requestMentorError && <p className="text-red-600 mt-2">Error: {requestMentorError}</p>}
            {updateMenteesError && <p className="text-red-600 mt-2">Error: {updateMenteesError}</p>}
          </section>

          {/* Mentees Section - only show if user is a mentor */}
          {isMentor && (
            <section className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">My Mentees</h2>
              
              {/* Current mentees */}
              <div className="mb-4">
                <h3 className="font-medium mb-2">Current Mentees:</h3>
                {currentUser.mentees && currentUser.mentees.length > 0 ? (
                  <div className="space-y-2">
                    {currentUser.mentees.map(mentee => {
                      const menteeUser = allUsers.find(u => u.id === mentee.id);
                      return (
                        <div key={mentee.id} className="p-2 border rounded">
                          {menteeUser?.displayName || menteeUser?.spiritualName || menteeUser?.worldlyName || menteeUser?.email}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-600">No mentees assigned yet.</p>
                )}
              </div>

              {/* Add/Edit mentees */}
              <div>
                <h3 className="font-medium mb-2">Manage Mentees:</h3>
                <ChipsSelector
                  selectedIds={currentUser.mentees?.map(m => m.id) || []}
                  items={allUsers
                    .filter(user => user.id !== userId) // Don't include self
                    .map(user => ({
                      id: user.id,
                      label: user.displayName || user.spiritualName || user.worldlyName || user.email,
                      entityType: "user" as const,
                    }))}
                  onChange={(menteeIds) => updateMentees(menteeIds)}
                  placeholder="Search for users to add as mentees..."
                />
              </div>
            </section>
          )}

          {/* Unit Stats placeholder */}
          <section className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Unit Stats</h2>
            <p>Placeholder for Unit Stats section.</p>
          </section>

          {/* Global Stats placeholder */}
          <section className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Global Stats</h2>
            <p>Placeholder for Global Stats section.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
