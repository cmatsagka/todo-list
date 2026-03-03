import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	js.configs.recommended,
	eslintConfigPrettier,
	{
		rules: {
			'no-unused-vars': 'warn',
			'no-undef': 'error',
			'no-console': 'off',
		},
	},
];
