import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // FSD architecture boundaries: enforces the layer-direction import rule
  // and slice public-API (index.ts) entry points described in CLAUDE.md
  // under "FSD layers (src/)". See https://www.jsboundaries.dev/docs/setup/.
  {
    files: ["src/**/*.{ts,tsx}", "app/**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        // Next.js App Router shell (root app/) — routing only, no business logic.
        { type: "next-app", pattern: "app/**", mode: "full" },
        // FSD "app" layer (src/app) — global providers, composed in app/layout.tsx.
        { type: "fsd-app", pattern: "src/app/**", mode: "full" },
        { type: "views", pattern: "views/*", capture: ["slice"] },
        { type: "widgets", pattern: "widgets/*", capture: ["slice"] },
        { type: "features", pattern: "features/*", capture: ["slice"] },
        { type: "entities", pattern: "entities/*", capture: ["slice"] },
        { type: "shared", pattern: "shared/*", capture: ["slice"] },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: { type: "next-app" },
              allow: { to: { type: ["next-app", "fsd-app", "views", "widgets", "shared"] } },
            },
            {
              from: { type: "fsd-app" },
              allow: {
                to: { type: ["fsd-app", "views", "widgets", "features", "entities", "shared"] },
              },
            },
            {
              from: { type: "views" },
              allow: { to: { type: ["widgets", "features", "entities", "shared"] } },
            },
            {
              from: { type: "widgets" },
              allow: { to: { type: ["features", "entities", "shared"] } },
            },
            {
              from: { type: "features" },
              allow: { to: { type: ["entities", "shared"] } },
            },
            {
              from: { type: "entities" },
              allow: { to: { type: "shared" } },
            },
            // Public API only: block deep/internal imports into another
            // slice (own-slice internal files are exempt by default).
            {
              to: {
                type: ["views", "widgets", "features", "entities"],
                internalPath: "!index.ts",
              },
              disallow: { from: { type: "*" } },
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
