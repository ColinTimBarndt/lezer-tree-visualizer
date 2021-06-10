import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";
import npmpkg from "./package.json";
import alias from '@rollup/plugin-alias';
import path from 'path';

export default [
	config("os", "index.cjs", "cjs", "src/index.ts"),
	config("web", "index.js", "es", "src/index.ts"),
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

function config(platform, file, format, inputFiles) {
	return {
		input: inputFiles,
		output: {
			file: "dist/" + file,
			format: format,
		},
		external: Object.keys(npmpkg.dependencies),
		plugins: [
			nodeResolve(),
			typescript(),
			target(platform),
		],
	};
}

function target(t) {
	return alias({
		entries: [
			{
				find: /\/platform-color$/,
				customResolver(relative, origin) {
					if (/node_modules/.test(origin)) return;
					return path.resolve(__dirname, "src", t + "-color.ts");
				}
			}
		]
	});
}