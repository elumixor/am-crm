"use client";
import { Avatar, AvatarFallback, AvatarImage } from "components/shad/avatar";
import { Badge } from "components/shad/badge";
import { Button } from "components/shad/button";
import { cn } from "lib/cn";
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
    <Badge variant="secondary" className="flex items-center gap-2 pr-1 max-w-60">
      <Link href={href} className="flex items-center gap-2 flex-1 min-w-0 no-underline hover:no-underline">
        <Avatar 
          className={cn(
            "flex-shrink-0",
            type === "unit" ? "rounded-md" : "rounded-full"
          )} 
          style={{ width: size, height: size }}
        >
          <AvatarImage src={photoUrl || undefined} alt={name} />
          <AvatarFallback className={cn(
            "text-xs font-semibold",
            type === "unit" ? "rounded-md" : "rounded-full"
          )}>
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs truncate">{name}</span>
      </Link>
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
          aria-label={`Remove ${name}`}
        >
          ×
        </Button>
      )}
    </Badge>
  );
};
