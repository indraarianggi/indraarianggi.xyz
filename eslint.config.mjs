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
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx,astro}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Add any custom rules here
    },
  },
];

export default eslintConfig;
