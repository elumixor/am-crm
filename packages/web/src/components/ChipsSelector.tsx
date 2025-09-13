"use client";
import { Input } from "components/shad/input";
import { Label } from "components/shad/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/shad/select";
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
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <div className="flex gap-2">
        <Input
          placeholder={placeholder ?? "Search..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Select
          value=""
          onValueChange={(id) => {
            if (!id) return;
            onChange([...selectedIds, id]);
            setQuery("");
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Add..." />
          </SelectTrigger>
          <SelectContent>
            {filtered.map((i: ChipsSelectorItem) => (
              <SelectItem key={i.id} value={i.id}>
                {i.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
                type={item?.entityType ?? "user"}
                name={item?.label ?? id}
                href={item?.href ?? "#"}
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
