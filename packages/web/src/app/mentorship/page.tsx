"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/shad/card";
import { Button } from "components/shad/button";
import { useAuth } from "contexts/AuthContext";
import { useAsyncWithError } from "lib/hooks";
import { useCallback, useEffect, useState } from "react";
import { validJsonInternal } from "services/http";
import { ChipsSelector } from "components/ChipsSelector";

interface User {
  id: string;
  email: string;
  spiritualName?: string | null;
  worldlyName?: string | null;
  displayName?: string | null;
  mentorId?: string | null;
  mentees?: { id: string; email: string; displayName?: string; spiritualName?: string; worldlyName?: string }[];
}

export default function MentorshipPage() {
  const { client, userId } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Since we don't have traits, let's use a simple rule: 
  // A user can be a mentor if they have mentees OR if they want to become one
  const [wantsToBeMentor, setWantsToBeMentor] = useState(false);
  const isMentor = (currentUser?.mentees && currentUser.mentees.length > 0) || wantsToBeMentor;
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
      
      // Check if user already has mentees (they're already a mentor)
      setWantsToBeMentor((user?.mentees && user.mentees.length > 0) || false);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [client, userId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // Request a mentor (placeholder - would need actual implementation)
  const [requestMentor, requestMentorError, requestMentorLoading] = useAsyncWithError(async () => {
    // For now, just show an alert - in a real app this would create a request
    alert("Mentor request functionality would be implemented here. This might involve creating a request record or notifying potential mentors.");
  });

  // Become a mentor (simplified - just enables mentor UI)
  const [becomeMentor, becomeMentorError, becomeMentorLoading] = useAsyncWithError(async () => {
    setWantsToBeMentor(true);
  });

  // Stop mentoring (remove all mentees)
  const [stopMentoring, stopMentoringError, stopMentoringLoading] = useAsyncWithError(async () => {
    if (!userId) return;
    
    const response = await client.mentees.$put({ 
      json: { menteeIds: [] }
    });
    
    await validJsonInternal(response);
    setWantsToBeMentor(false);
    await loadData();
  });

  // Update mentees
  const [updateMentees, updateMenteesError, _updateMenteesLoading] = useAsyncWithError(async (menteeIds: string[]) => {
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
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mentorship</h1>
          <p className="text-muted-foreground mt-2">
            Manage mentorship relationships and track progress.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Action Buttons Section */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Manage your mentorship role and relationships</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Mentees Section - only show if user is a mentor */}
          {isMentor && (
            <Card>
              <CardHeader>
                <CardTitle>My Mentees</CardTitle>
                <CardDescription>Manage your mentee assignments</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Current mentees */}
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Current Mentees:</h3>
                  {currentUser.mentees && currentUser.mentees.length > 0 ? (
                    <div className="space-y-2">
                      {currentUser.mentees.map(mentee => (
                        <div key={mentee.id} className="p-2 border rounded">
                          {mentee.displayName || mentee.spiritualName || mentee.worldlyName || mentee.email}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No mentees assigned yet.</p>
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
              </CardContent>
            </Card>
          )}

          {/* Mentor Info Section */}
          {hasMentor && (
            <Card>
              <CardHeader>
                <CardTitle>My Mentor</CardTitle>
                <CardDescription>Your assigned mentor information</CardDescription>
              </CardHeader>
              <CardContent>
                <p>You have a mentor assigned (ID: {currentUser.mentorId})</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Unit Statistics</CardTitle>
              <CardDescription>
                Overview of mentorship activities within your unit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Unit statistics will be displayed here when data is available.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Global Statistics</CardTitle>
              <CardDescription>
                System-wide mentorship metrics and insights.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Global statistics will be displayed here when data is available.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}