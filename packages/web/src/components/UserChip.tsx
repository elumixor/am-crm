"use client";
import Link from "next/link";
import React from "react";
import styles from "./EntityChip.module.scss";

export interface User {
  id: string;
  displayName?: string | null;
  spiritualName?: string | null;
  worldlyName?: string | null;
  preferredName?: string | null;
  preferredNameType?: string | null;
  photoKey?: string | null;
}

export interface UserChipProps {
  user: User;
  onRemove?: () => void;
  size?: number; // pixel height
  showLink?: boolean;
}

export const UserChip: React.FC<UserChipProps> = ({ user, onRemove, size = 28, showLink = true }) => {
  const displayName = React.useMemo(() => {
    if (user.preferredNameType === "spiritual" && user.spiritualName) {
      return user.spiritualName;
    }
    if (user.preferredNameType === "worldly" && user.worldlyName) {
      return user.worldlyName;
    }
    if (user.preferredNameType === "custom" && user.preferredName) {
      return user.preferredName;
    }
    // Fallback logic
    return user.displayName || user.spiritualName || user.worldlyName || user.preferredName || user.id;
  }, [user]);

  const photoUrl = user.photoKey ? `/api/photo/${user.photoKey}` : null;

  const initials = React.useMemo(() => {
    if (photoUrl) return null;

    const src = displayName || user.id;
    const letters = src
      .replace(/https?:\/\//, "")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim();

    if (!letters) return "?";
    const parts = letters.split(/\s+/).filter(Boolean);

    if (parts.length === 1) return (parts[0] || "").slice(0, 2).toUpperCase();
    if (parts.length >= 2) {
      const a = parts[0]?.[0] || "";
      const b = parts[1]?.[0] || "";
      return (a + b).toUpperCase();
    }

    return "?";
  }, [photoUrl, displayName, user.id]);

  const content = (
    <>
      <span
        className={styles.avatar}
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
      <span className={styles.name}>{displayName}</span>
    </>
  );

  return (
    <span className={styles.chip}>
      {showLink ? (
        <Link href={`/users/${user.id}`} className={styles.link}>
          {content}
        </Link>
      ) : (
        <span className={styles.link}>{content}</span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className={styles.removeButton}
          aria-label={`Remove ${displayName}`}
        >
          ×
        </button>
      )}
    </span>
  );
};
