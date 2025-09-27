const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
  {
    rules: {
      semi: "error",
      "prefer-const": "error",
    },
    ignores: [
      'ios/**/*',
      'android/**/*',
      'dist/**/*'
    ]
  },
]);
