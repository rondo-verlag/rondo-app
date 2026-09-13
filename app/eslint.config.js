const pluginVue = require('eslint-plugin-vue');
const { withVueTs, vueTsConfigs } = require('@vue/eslint-config-typescript');

module.exports = withVueTs(
  {
    ignores: [
      'coverage/**',
      'dist/**',
      'ios/**',
      'android/**',
      'public/**',
    ],
  },
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    rules: {
      semi: 'error',
      'prefer-const': 'error',
      // Ionic components render native web-component slots (slot="start"/"end"),
      // not Vue scoped slots, so this rule doesn't apply to them.
      'vue/no-deprecated-slot-attribute': 'off',
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    files: ['eslint.config.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    // The base `semi` rule misidentifies the end of a `TSInterfaceDeclaration`
    // and demands an ever-growing number of semicolons on `--fix`.
    files: ['src/interfaces/**/*.ts'],
    rules: {
      semi: 'off',
    },
  },
);
