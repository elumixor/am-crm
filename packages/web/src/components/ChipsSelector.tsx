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
    <div className="space-y-4">
      {label && <span className="text-sm font-medium">{label}</span>}
      <div className="flex flex-row gap-2 items-center">
        <input
          placeholder={placeholder || "Search..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
        />
        <select
          value=""
          onChange={(e) => {
            const id = e.target.value;
            if (!id) return;
            onChange([...selectedIds, id]);
            setQuery("");
          }}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Add...</option>
          {filtered.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedIds.map((id) => {
            const item = items.find((i) => i.id === id);
            if (!item) return null;
            return (
              <EntityChip
                key={id}
                id={id}
                type={item.entityType || "user"}
                name={item.label}
                href={item.href || `/users/${id}`}
                photoUrl={item.photoUrl}
                onRemove={() => onChange(selectedIds.filter((sid) => sid !== id))}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
