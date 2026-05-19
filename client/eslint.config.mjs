import js from '@eslint/js'
import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ['**/*.{js,jsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    rules: {
      'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
      camelcase: ['error', { properties: 'always', allow: ['Geist_Mono'] }],
      'eol-last': ['error', 'always'],
      indent: ['error', 2],
      'key-spacing': ['error', { 'mode': 'strict' }],
      'max-depth': ['warn', { 'max': 3 }],
      'max-len': ['warn', 
        { 
          'code': 120,
          'ignoreComments': true,
          'ignoreUrls': true
        }],
      'max-params': ['warn', { 'max': 3 }],
      'object-curly-spacing': ['error', 'always'],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
    },
  }
])

export default eslintConfig
