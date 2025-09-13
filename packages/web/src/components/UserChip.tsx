"use client";
import { Avatar, AvatarFallback, AvatarImage } from "components/shad/avatar";
import { Badge } from "components/shad/badge";
import { Button } from "components/shad/button";
import Link from "next/link";
import React from "react";

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
      <Avatar className="flex-shrink-0" style={{ width: size, height: size }}>
        <AvatarImage src={photoUrl || undefined} alt={displayName} />
        <AvatarFallback className="text-xs font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <span className="text-xs truncate">{displayName}</span>
    </>
  );

  return (
    <Badge variant="secondary" className="flex items-center gap-2 pr-1 max-w-60">
      {showLink ? (
        <Link href={`/users/${user.id}`} className="flex items-center gap-2 flex-1 min-w-0 no-underline hover:no-underline">
          {content}
        </Link>
      ) : (
        <span className="flex items-center gap-2 flex-1 min-w-0">{content}</span>
      )}
      {onRemove && (
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 hover:bg-transparent"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${displayName}`}
        >
          ×
        </Button>
      )}
    </Badge>
  );
};
