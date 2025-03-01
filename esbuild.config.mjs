import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = process.argv[2] === "production";

const buildOptions = {
	banner: {
		js: banner,
	},
	entryPoints: ["src/AugmentedCanvasPlugin.ts"],
	bundle: true,
	external: [
		"obsidian",
		"electron",
		"@codemirror/autocomplete",
		"@codemirror/collab",
		"@codemirror/commands",
		"@codemirror/language",
		"@codemirror/lint",
		"@codemirror/search",
		"@codemirror/state",
		"@codemirror/view",
		"@lezer/common",
		"@lezer/highlight",
		"@lezer/lr",
		...builtins,
	],
	format: "cjs",
	target: "es2018",
	logLevel: "info",
	sourcemap: prod ? false : "inline",
	treeShaking: true,
	outfile: "main.js",
};

if (prod) {
	esbuild.build(buildOptions).catch(() => process.exit(1));
} else {
	// 开发模式使用 context API
	esbuild.context(buildOptions).then(context => {
		// 启动监视
		context.watch();
		console.log('Watching for changes...');
	}).catch(() => process.exit(1));
}
