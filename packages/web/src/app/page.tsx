"use client";

import { Icon } from "components/Icon";
import { Card, CardDescription, CardHeader, CardTitle } from "components/shad/card";
import Link from "next/link";
import type { IconName } from "styles/types";

export default function DashboardPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Users"
          description="Manage and view all users in the system."
          icon="people"
          href="/users"
        />
        <DashboardCard
          title="Mentorship"
          description="View and manage mentorship relationships."
          icon="mentorship"
          href="/mentorship"
        />
        <DashboardCard title="Units" description="Organize and oversee different units." icon="unit" href="/units" />
      </div>
    </main>
  );
}

function DashboardCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: IconName;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="transition-all duration-200 hover:bg-accent/50 hover:shadow-md cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Icon icon={icon} size="md" />
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="text-sm mt-1">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
