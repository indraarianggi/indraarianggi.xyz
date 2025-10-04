import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import astroPlugin from "eslint-plugin-astro";

const eslintConfig = [
  {
    ignores: [
      ".cache/**",
      ".astro/**",
      "dist/**",
      "bun.lock",
      "public/**",
      "node_modules/**",
      "astro.config.mjs",
      ".env",
      ".env.*",
    ],
  },
  // JavaScript files
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {},
  },
  // TypeScript files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },
  // Astro files
  ...astroPlugin.configs.recommended,
];

export default eslintConfig;
