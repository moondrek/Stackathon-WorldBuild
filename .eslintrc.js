module.exports = {
  env: { browser: true, es2021: true, node: true },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {},
};
