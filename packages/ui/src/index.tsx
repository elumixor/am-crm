// Shared UI primitives (scaffold) - Issue #1
// Intentionally tiny until design system decisions.
import * as React from "react";

export interface PillProps {
  children: React.ReactNode;
}

export function Pill({ children }: PillProps) {
  return <span style={{ padding: "2px 6px", border: "1px solid #ccc", borderRadius: 8 }}>{children}</span>;
}

export const UI_SCAFFOLD = true;
