/**
 * User-related utility functions
 */

interface UserLike {
  displayName?: string | null;
  spiritualName?: string | null;
  worldlyName?: string | null;
  email: string;
  id?: string;
}

/**
 * Get the display name for a user, with fallback logic
 */
export const getUserDisplayName = (user: UserLike): string =>
  user.displayName ?? user.spiritualName ?? user.worldlyName ?? user.email;

/**
 * Get initials from user display name
 */
export const getUserInitials = (user: UserLike): string => {
  const displayName = getUserDisplayName(user);
  const src = displayName || user.id || "?";
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
};
