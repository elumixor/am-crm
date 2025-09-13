"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/shad/card";

export default function MentorshipPage() {
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
          <Card>
            <CardHeader>
              <CardTitle>My Mentees</CardTitle>
              <CardDescription>
                View and manage your current mentees and their progress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No mentees assigned yet. This section will display your mentees when available.
              </p>
            </CardContent>
          </Card>

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
