import { Avatar, AvatarFallback, AvatarImage } from "components/shad/avatar";
import { cn } from "lib/cn";
import React from "react";

export interface UserProfilePictureProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
  editable?: boolean;
  loading?: boolean;
}

export const UserProfilePicture: React.FC<UserProfilePictureProps> = ({
  src,
  alt,
  size = "md",
  className,
  onClick,
  editable = false,
  loading = false,
}) => {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-30 h-30",
  };

  const sizeClass = sizeMap[size];

  const initials = React.useMemo(() => {
    const name = alt || "";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0]?.[0] + parts[1]?.[0]).toUpperCase();
    }
    if (parts.length === 1) {
      return parts[0]?.slice(0, 2).toUpperCase() || "?";
    }
    return "?";
  }, [alt]);

  const avatarElement = (
    <Avatar className={cn(sizeClass, className)}>
      <AvatarImage src={src || undefined} alt={alt} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "relative transition-all duration-200",
          editable && "hover:opacity-80",
          loading && "animate-pulse",
        )}
        disabled={loading}
      >
        {avatarElement}
        {editable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-medium">{loading ? "Uploading..." : "Change"}</span>
          </div>
        )}
      </button>
    );
  }

  return avatarElement;
};
