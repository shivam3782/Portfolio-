import { createRequire } from "node:module";
const require = createRequire(
  new URL("../frontend/package.json", import.meta.url),
);
const js = require("@eslint/js");
const globals = require("globals");
export default [
  { ignores: ["node_modules/**", "coverage/**"] },
  {
    files: ["**/*.{js,cjs}"],
    ...js.configs.recommended,
    languageOptions: { sourceType: "commonjs", globals: globals.node },
    rules: { "no-unused-vars": ["error", { argsIgnorePattern: "^_" }] },
  },
];
