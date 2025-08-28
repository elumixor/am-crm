// Centralized tooling configuration exports (scaffold) - Issue #1
// Future: export eslint/biome/prettier/tailwind configs.

export const tooling = {
  biome: {
    extends: ["@biomejs/biome:recommended"],
  },
  notes: "placeholder config export",
};

export type ToolingConfig = typeof tooling;
