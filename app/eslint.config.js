import pluginVue from 'eslint-plugin-vue';
import vueTs from '@vue/eslint-config-typescript';

export default [
  {
    ignores: [
      '**/dist/**',
      '**/android/**',
      '**/ios/**',
      '**/public/**',
      '**/node_modules/**',
      '**/.idea/**',
    ],
  },
  ...pluginVue.configs['flat/essential'],
  ...vueTs(),
  {
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'vue/no-deprecated-slot-attribute': 'off',
      'vue/no-unused-components': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'vue/multi-word-component-names': 'off',
    },
  },
];
