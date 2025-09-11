import Image from "next/image";
import type React from "react";
import styles from "./UserProfilePicture.module.scss";

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
  const pictureClasses = [
    styles.picture,
    styles[`picture--${size}`],
    editable && styles["picture--editable"],
    loading && styles["picture--loading"],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 64,
    xl: 120,
  };

  const pictureSize = sizeMap[size];

  const handleClick = () => {
    if (onClick && (editable || onClick)) {
      onClick();
    }
  };

  return onClick ? (
    <button type="button" className={pictureClasses} onClick={handleClick}>
      {src ? (
        <Image src={src} alt={alt} width={pictureSize} height={pictureSize} className={styles.image} />
      ) : (
        <div className={styles.placeholder}>
          <svg className={styles.placeholderIcon} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      )}
      {editable && (
        <div className={styles.overlay}>
          <div className={styles.overlayText}>{loading ? "Uploading..." : "Change Photo"}</div>
        </div>
      )}
    </button>
  ) : (
    <div className={pictureClasses}>
      {src ? (
        <Image src={src} alt={alt} width={pictureSize} height={pictureSize} className={styles.image} />
      ) : (
        <div className={styles.placeholder}>
          <svg className={styles.placeholderIcon} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      )}
    </div>
  );
};
