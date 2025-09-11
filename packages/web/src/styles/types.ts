export type IconName = "book" | "delete" | "edit" | "logo" | "mentorship" | "people" | "unit" | "user";

// This is needed for Image component that requires width and height at compile time
// Make sure to keep this in sync with styles/components/icon.scss
// $sm: 24px;
// $md: 34px;
// $lg: 42px;
export const iconSizes = { sm: 24, md: 34, lg: 42 } as const;
export type IconSize = keyof typeof iconSizes;
export type IconSizePx = (typeof iconSizes)[IconSize];
