import Image from "next/image";
import { forwardRef } from "react";
import { type IconName, type IconSize, iconSizes } from "styles/types";

interface IconProps {
  icon: IconName;
  alt?: string;
  size?: IconSize;
  className?: string;
}

export const Icon = forwardRef<HTMLImageElement, IconProps>(({ icon, alt = icon, size = "md", className }, ref) => {
  const src = `/images/${icon}.png`;

  // Image requires width and height, so we cannot use CSS for sizing
  const sizePx = iconSizes[size];

  return (
    // Provide the class nevertheless for possible custom styling
    <Image src={src} alt={alt} className={`icon-${size} ${className}`} ref={ref} width={sizePx} height={sizePx} />
  );
});
