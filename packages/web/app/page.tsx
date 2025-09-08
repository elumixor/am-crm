"use client";

import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main style={{ padding: "24px" }}>
      <h1 style={{ marginBottom: "32px" }}>Dashboard</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        <Card
          title="Users"
          description="Manage and view all users in the system."
          iconSrc="/images/people.png"
          href="/users"
        />
        <Card
          title="Mentorship"
          description="View and manage mentorship relationships."
          iconSrc="/images/mentorship.png"
          href="/mentees"
        />
        <Card
          title="Units"
          description="Organize and oversee different units."
          iconSrc="/images/unit.png"
          href="/units"
        />
      </div>
    </main>
  );
}

function Card({
  title,
  description,
  iconSrc,
  href,
}: {
  title: string;
  description: string;
  iconSrc: string;
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
        textDecoration: "none",
        color: "inherit",
        display: "block",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "24px",
        background: "#fff",
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "48px",
          height: "48px",
        }}
      >
        <Image src={iconSrc} alt={title} width={32} height={32} />
      </div>
      <h2 style={{ margin: "0 0 8px 0", fontSize: "24px", color: "#1f2937" }}>{title}</h2>
      <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>{description}</p>
    </Link>
  );
}
