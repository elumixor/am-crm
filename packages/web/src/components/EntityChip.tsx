"use client";
import Link from "next/link";
import React from "react";
import styles from "./EntityChip.module.scss";

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
    <span className={styles.chip}>
      <Link href={href} className={styles.link}>
        <span
          className={`${styles.avatar} ${type === "unit" ? styles.avatarUnit : ""}`}
          style={(() => {
            const s: React.CSSProperties & { "--size"?: string } = {
              backgroundImage: photoUrl ? `url(${photoUrl})` : undefined,
            };
            s["--size"] = `${size}px`;
            return s;
          })()}
        >
          {!photoUrl && initials}
        </span>
        <span className={styles.name}>{name}</span>
      </Link>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className={styles.removeButton}
          aria-label={`Remove ${name}`}
        >
          ×
        </button>
      )}
    </span>
  );
};
