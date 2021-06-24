import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import { string } from "rollup-plugin-string";
import multi from '@rollup/plugin-multi-entry';

const baseConfig = {
	input: "tests/**/*.test.ts",
	inlineDynamicImports: true,
	plugins: [
		string({
			include: ["**/*.java"]
		}),
		typescript(),
		nodeResolve(),
		multi(),
	],
};

export default [
	{
		...baseConfig,
		output: {
			file: "tests/dist/tests.cjs",
			format: "cjs",
			sourcemap: true,
		},
		external: /node_modules/,
	},
	{
		...baseConfig,
		output: {
			file: "tests/dist/tests.js",
			format: "es",
			sourcemap: true,
		}
	}
];