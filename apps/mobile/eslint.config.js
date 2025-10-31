import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import ts from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: [
      "dist/**",
      "build/**",
      "node_modules/**",
      "babel.config.js",
      "metro.config.js",
      "jest.config.js",
      ".prettierrc.js",
      "android/**",
      "ios/**"
    ]
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: { "@typescript-eslint": ts },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      // CI was crashing here on GitHub:
      "@typescript-eslint/no-unused-expressions": "off",
      "no-undef": "off"
    }
  },
  {
    files: ["**/__tests__/**/*.{ts,tsx,js,jsx}", "**/*.test.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true }
      },
      globals: {
        test: "readonly",
        expect: "readonly",
        describe: "readonly",
        beforeEach: "readonly",
        jest: "readonly"
      }
    },
    rules: {}
  }
];
