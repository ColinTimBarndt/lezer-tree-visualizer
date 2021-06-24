import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";
import npmpkg from "./package.json";

export default [
	{
		input: "src/index.ts",
		output: [
			{
				file: "dist/index.js",
				format: "es",
			},
			{
				file: "dist/index.cjs",
				format: "cjs",
			}
		],
		external: Object.keys(npmpkg.dependencies),
		plugins: [
			nodeResolve(),
			typescript(),
			terser(),
		],
	},
	{
		input: "src/index.ts",
		output: {
			file: "dist/index.d.ts",
			format: "es"
		},
		plugins: [
			dts(),
		],
	},
];