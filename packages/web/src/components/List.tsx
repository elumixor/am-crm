import type React from "react";
import styles from "./List.module.scss";

export interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  variant?: "default" | "card" | "table";
  spacing?: "sm" | "md" | "lg";
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  loadingItems?: number;
}

export function List<T>({
  items,
  renderItem,
  keyExtractor,
  variant = "default",
  spacing = "md",
  className,
  emptyMessage = "No items found",
  loading = false,
  loadingItems = 3,
}: ListProps<T>) {
  const listClasses = [styles.list, styles[`list--${variant}`], styles[`list--spacing-${spacing}`], className]
    .filter(Boolean)
    .join(" ");

  if (loading) {
    return (
      <div className={listClasses}>
        {Array.from({ length: loadingItems }, (_, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: It's okay here for loading placeholders
            key={`loading-${index}`}
            className={styles.loadingItem}
          >
            <div className={styles.loadingSkeleton} />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyMessage}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={listClasses}>
      {items.map((item, index) => (
        <div key={keyExtractor(item, index)} className={styles.listItem}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
