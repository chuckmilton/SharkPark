import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import ts from "@typescript-eslint/eslint-plugin";

export default [
  // ignore build + mobile (mobile lints itself)
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/.turbo/**",
      "**/node_modules/**",
      "apps/mobile/**"
    ]
  },

  // workspace TS/JS
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      "@typescript-eslint": ts
    },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules
    }
  },

  // node config files outside mobile
  {
    files: ["**/*.config.js", "**/*.config.cjs", "**/.prettierrc.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script"
    },
    rules: {
      "no-undef": "off"
    }
  }
];
