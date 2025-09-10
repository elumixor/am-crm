"use client";

import { Icon } from "components/Icon";
import Link from "next/link";
import type { IconName } from "styles/types";

export default function DashboardPage() {
  return (
    <main style={{ padding: "24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        <Card title="Users" description="Manage and view all users in the system." icon="people" href="/users" />
        <Card
          title="Mentorship"
          description="View and manage mentorship relationships."
          icon="mentorship"
          href="/mentees"
        />
        <Card title="Units" description="Organize and oversee different units." icon="unit" href="/units" />
      </div>
    </main>
  );
}

function Card({
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
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = "#f8fafc";
    e.currentTarget.style.borderColor = "#cbd5e1";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = "#fff";
    e.currentTarget.style.borderColor = "#e2e8f0";
  };

  return (
    <Link
      href={href}
      style={{
        color: "inherit",
        display: "block",
        border: "1px solid #e2e8f0",
        background: "#fff",
        transition: "all 0.2s ease",
      }}
      className="unstyled p-lg rounded"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex gap-md">
        <Icon icon={icon} size="md" />
        <div className="flex-column">
          <h2 style={{ margin: "0 0 8px 0", fontSize: "24px", color: "#1f2937" }}>{title}</h2>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>{description}</p>
        </div>
      </div>
    </Link>
  );
}
