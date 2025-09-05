"use client";
import { useState } from "react";
import { EntityChip } from "./EntityChip";

export interface ChipsSelectorItem {
  id: string;
  label: string; // display label / name
  href?: string; // optional link target (used by EntityChip)
  photoUrl?: string | null; // optional avatar
  entityType?: "user" | "unit"; // default user
}

interface ChipsSelectorProps {
  label?: string;
  selectedIds: string[];
  items: ChipsSelectorItem[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
}

// Explicit any param destructure to appease Next.js serializable props rule for client component dynamic functions.
export function ChipsSelector(props: ChipsSelectorProps) {
  const { label, selectedIds, items, onChange, placeholder } = props;
  const [query, setQuery] = useState("");
  const selectedSet = new Set(selectedIds);
  const pool = items.filter((i: ChipsSelectorItem) => !selectedSet.has(i.id));
  const filtered = query
    ? pool.filter((i: ChipsSelectorItem) => i.label.toLowerCase().includes(query.toLowerCase()))
    : pool.slice(0, 50);

  return (
    <div style={{ display: "grid", gap: 4 }}>
      {label && <span style={{ fontSize: 12, fontWeight: 600, userSelect: "none" }}>{label}</span>}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          placeholder={placeholder || "Search..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1 }}
        />
        <select
          value=""
          onChange={(e) => {
            const id = e.target.value;
            if (!id) return;
            onChange([...selectedIds, id]);
            setQuery("");
          }}
        >
          <option value="">Add...</option>
          {filtered.map((i: ChipsSelectorItem) => (
            <option key={i.id} value={i.id}>
              {i.label}
            </option>
          ))}
        </select>
      </div>
      {selectedIds.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {selectedIds.map((id) => {
            const item = items.find((x) => x.id === id);
            return (
              <EntityChip
                key={id}
                id={id}
                type={item?.entityType || "user"}
                name={item?.label || id}
                href={item?.href || "#"}
                photoUrl={item?.photoUrl}
                onRemove={() => onChange(selectedIds.filter((x) => x !== id))}
                size={24}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
