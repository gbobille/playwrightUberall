import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';
import playwrightPlugin from 'eslint-plugin-playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    resolvePluginsRelativeTo: __dirname,
});

const eslintConfig = [
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: typescriptEslintParser,
            parserOptions: {
                ecmaVersion: 12,
                sourceType: 'module',
                project: path.resolve(__dirname, './tsconfig.json'),
                tsconfigRootDir: __dirname,
            },
        },
        plugins: {
            '@typescript-eslint': typescriptEslintPlugin,
            'playwright': playwrightPlugin,
        },
        rules: {
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/await-thenable": "error"
        },
    },
    ...compat.extends('plugin:@typescript-eslint/recommended', 'plugin:playwright/recommended'),
    {
        files: ['eslint.config.mjs'],
        languageOptions: {
            parser: typescriptEslintParser,
            parserOptions: {
                ecmaVersion: 12,
                sourceType: 'module',
                project: path.resolve(__dirname, './tsconfig.json'),
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/await-thenable": "error"
        },
    },
];

export default eslintConfig;