import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import { string } from "rollup-plugin-string";
import { readdir } from "fs";
import multi from '@rollup/plugin-multi-entry';
import alias from '@rollup/plugin-alias';

import path from "path";

export default new Promise((resolve, reject) => {
	readdir("tests", {}, (err, files) => {
		const inputFiles = files
			.filter(f => f.endsWith(".test.ts"))
			.map(f => `tests/${f}`);
		if (err) return reject(err);
		resolve([
			config("os", "tests.cjs", "cjs", inputFiles),
			config("web", "tests.js", "es", inputFiles),
		]);
	});
});

function config(platform, file, format, inputFiles) {
	return {
		input: inputFiles,
		output: {
			file: "tests/dist/" + file,
			format: format,
			sourcemap: true,
		},
		inlineDynamicImports: true,
		external: platform === "os"
			? [
				/node_modules/,
			]
			: [],
		plugins: [
			string({
				include: ["**/*.java"]
			}),
			typescript(),
			nodeResolve(),
			multi(),
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
					if (/\/node_modules\//.test(origin)) return;
					return path.resolve(__dirname, "src", t + "-color.ts");
				}
			}
		]
	});
}