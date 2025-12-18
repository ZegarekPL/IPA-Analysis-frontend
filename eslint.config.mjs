import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import react from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
	{
		ignores: [
			'**/node_modules/',
			'**/.next/',
			'**/.git/',
			'**/.github/',
			'**/docker-compose.yml',
			'**/Dockerfile',
			'**/README.md',
			'**/.env*',
			'**/dist',
			'**/build',
		],
	},

	js.configs.recommended,

	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
				project: './tsconfig.json',
			},
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
			react,
			prettier: prettierPlugin,
			'simple-import-sort': simpleImportSort,
			'unused-imports': unusedImports,
		},
		rules: {
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'prettier/prettier': [
				'error',
				{
					printWidth: 120,
					useTabs: true,
					singleQuote: true,
					tabWidth: 2,
					endOfLine: 'auto',
				},
			],
			'simple-import-sort/imports': ['error', { groups: [['^react', '^@?\\w'], ['^\\u0000'], ['^@?\\w'], ['^\\.']] }],
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					ignoreRestSiblings: true,
				},
			],
		},
	},
];
