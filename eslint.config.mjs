import { fixupPluginRules } from "@eslint/compat";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import css from "eslint-plugin-css";
import ext from "eslint-plugin-ext";
import filenamesPlugin from "eslint-plugin-filenames";
import noUnsanitized from "eslint-plugin-no-unsanitized";
import perfectionist from "eslint-plugin-perfectionist";
import promise from "eslint-plugin-promise";
import security from "eslint-plugin-security";
import unicorn from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "**/next-env.d.ts",
    "**/.turbo/**",
    "**/dist/**",
    "**/node_modules/**",
    "**/public/**",
  ]),
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs}"],
    plugins: {
      css,
      ext,
      filenames: fixupPluginRules(filenamesPlugin),
      "no-unsanitized": noUnsanitized,
      perfectionist,
      promise,
      security,
      unicorn,
      "unused-imports": unusedImports,
    },
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "inline-type-imports",
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/promise-function-async": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      eqeqeq: ["error", "always", { null: "ignore" }],
      "ext/lines-between-object-properties": ["error", "never"],
      "filenames/match-exported": "off",
      "filenames/match-regex": "off",
      "filenames/no-index": "off",
      "import/newline-after-import": "off",
      "import/order": "off",
      "import/prefer-default-export": "off",
      "no-alert": "error",
      "no-console": "error",
      "no-duplicate-imports": "error",
      "no-else-return": "error",
      "no-lonely-if": "error",
      "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 0 }],
      "no-nested-ternary": "warn",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../../../*"],
              message:
                "相対パスが深すぎます（3階層以上）。ファイル配置を見直すか、エイリアス(@/)を使用してください。",
            },
          ],
        },
      ],
      "no-unneeded-ternary": "error",
      "no-unsanitized/method": "error",
      "no-unsanitized/property": "error",
      "no-useless-return": "error",
      "object-shorthand": "error",
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "never",
          next: ["case", "default"],
          prev: "case",
        },
        {
          blankLine: "never",
          next: "const",
          prev: "const",
        },
        {
          blankLine: "never",
          next: "let",
          prev: "let",
        },
        {
          blankLine: "never",
          next: "*",
          prev: "directive",
        },
        {
          blankLine: "always",
          next: [
            "const",
            "let",
            "var",
            "function",
            "class",
            "export",
            "expression",
            "block-like",
            "if",
            "for",
            "while",
            "switch",
            "try",
            "return",
            "throw",
          ],
          prev: "import",
        },
      ],
      "perfectionist/sort-exports": [
        "error",
        {
          order: "asc",
          partitionByNewLine: true,
          type: "natural",
        },
      ],
      "perfectionist/sort-imports": [
        "error",
        {
          groups: [],
          order: "asc",
          partitionByNewLine: false,
          type: "natural",
        },
      ],
      "perfectionist/sort-interfaces": [
        "error",
        {
          order: "asc",
          type: "natural",
        },
      ],
      "perfectionist/sort-jsx-props": [
        "error",
        {
          order: "asc",
          type: "natural",
        },
      ],
      "perfectionist/sort-named-imports": [
        "error",
        {
          order: "asc",
          type: "natural",
        },
      ],
      "perfectionist/sort-object-types": [
        "error",
        {
          order: "asc",
          type: "natural",
        },
      ],
      "perfectionist/sort-objects": [
        "error",
        {
          order: "asc",
          type: "natural",
        },
      ],
      "perfectionist/sort-union-types": [
        "error",
        {
          order: "asc",
          type: "natural",
        },
      ],
      "prefer-template": "error",
      "promise/always-return": ["error", { ignoreLastCallback: true }],
      "promise/catch-or-return": "error",
      "promise/no-nesting": "warn",
      "promise/no-return-wrap": "error",
      quotes: ["error", "double"],
      "react-hooks/exhaustive-deps": [
        "error",
        {
          enableDangerousAutofixThisMayCauseInfiniteLoops: true,
        },
      ],
      "react/hook-use-state": "error",
      "react/jsx-boolean-value": ["error", "always"],
      "react/jsx-newline": [
        "error",
        {
          prevent: true,
        },
      ],
      "react/no-array-index-key": "warn",
      "react/self-closing-comp": "error",
      "security/detect-non-literal-fs-filename": "off",
      "security/detect-non-literal-regexp": "off",
      "security/detect-non-literal-require": "off",
      "security/detect-object-injection": "off",
      "security/detect-possible-timing-attacks": "off",
      "security/detect-pseudoRandomBytes": "off",
      "security/detect-unsafe-regex": "off",
      semi: ["error", "always"],
      "unicorn/no-array-for-each": "error",
      "unicorn/no-array-push-push": "error",
      "unicorn/no-await-expression-member": "off",
      "unicorn/no-empty-file": "error",
      "unicorn/no-lonely-if": "error",
      "unicorn/no-negated-condition": "error",
      "unicorn/no-typeof-undefined": "error",
      "unicorn/no-useless-spread": "error",
      "unicorn/no-useless-undefined": "error",
      "unicorn/prefer-array-find": "error",
      "unicorn/prefer-array-flat": "error",
      "unicorn/prefer-array-flat-map": "error",
      "unicorn/prefer-array-some": "error",
      "unicorn/prefer-includes": "error",
      "unicorn/prefer-modern-dom-apis": "error",
      "unicorn/prefer-modern-math-apis": "error",
      "unicorn/prefer-number-properties": "error",
      "unicorn/prefer-optional-catch-binding": "error",
      "unicorn/prefer-spread": "error",
      "unicorn/prefer-string-slice": "error",
      "unicorn/prefer-string-starts-ends-with": "error",
      "unicorn/prefer-ternary": "off",
      "unicorn/throw-new-error": "error",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["**/components/ui/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "no-nested-ternary": "off",
    },
  },
  {
    files: ["scripts/**/*.{js,mjs,ts}"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "no-console": "off",
    },
  },
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/consistent-type-definitions": "off",
    },
  },
]);

export default eslintConfig;
