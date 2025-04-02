import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ["dist/**"],
  },
  // Additional rules to enforce stricter TypeScript usage
  {
    rules: {
      // Disallow the use of variables that are declared but not used
      // Variables starting with _ are excluded from this rule
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],

      // Disallow the usage of the any type
      "@typescript-eslint/no-explicit-any": "error",

      // Remove rules that require type checking
      // "@typescript-eslint/explicit-function-return-type": "error",
      // "@typescript-eslint/prefer-nullish-coalescing": "error",
    },
  },
];
