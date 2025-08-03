// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// FlatCompat helps use old-style config (extends) inside new Flat Config
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Old style configs from Next.js using compat
  ...compat.extends("next/core-web-vitals", "next"),

  // Custom rules
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",            // ✅ allow 'any'
      "react/no-unescaped-entities": "off",                    // ✅ fix don't, it's, etc
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
];
