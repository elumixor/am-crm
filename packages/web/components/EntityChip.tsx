"use client";
import Link from "next/link";
import React from "react";

export interface EntityChipProps {
  id: string;
  type: "user" | "unit";
  name: string;
  href: string;
  photoUrl?: string | null;
  onRemove?: () => void;
  size?: number; // pixel height
}

export const EntityChip: React.FC<EntityChipProps> = ({ id, type, name, href, photoUrl, onRemove, size = 28 }) => {
  const initials = React.useMemo(() => {
    if (photoUrl) return null;
    const src = name || id;
    const letters = src
      .replace(/https?:\/\//, "")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim();
    if (!letters) return type === "unit" ? "U" : "?";
    const parts = letters.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return (parts[0] || "").slice(0, 2).toUpperCase();
    if (parts.length >= 2) {
      const a = parts[0]?.[0] || "";
      const b = parts[1]?.[0] || "";
      return (a + b).toUpperCase();
    }
    return type === "unit" ? "U" : "?";
  }, [photoUrl, name, id, type]);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "#eef",
        padding: "2px 8px 2px 4px",
        borderRadius: 16,
        fontSize: 12,
        lineHeight: 1.2,
        position: "relative",
        maxWidth: 240,
        width: "fit-content",
      }}
    >
      <Link
        href={href}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "inherit",
          textDecoration: "none",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            width: size,
            height: size,
            borderRadius: type === "unit" ? 6 : "50%",
            background: photoUrl ? `url(${photoUrl})` : "#cdd",
            backgroundSize: "cover",
            backgroundPosition: "center",
            fontSize: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            border: "1px solid #bbb",
            boxSizing: "border-box",
            fontWeight: 600,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {!photoUrl && initials}
        </span>
        <span style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{name}</span>
      </Link>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            lineHeight: 1,
            padding: 0,
            marginLeft: 2,
            color: "#666",
          }}
          aria-label={`Remove ${name}`}
        >
          ×
        </button>
      )}
    </span>
  );
};
