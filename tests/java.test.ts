import code from "./Test.java";
import { parser } from "lezer-java";
import { visualize, VisibilityModifier, defaultTheme, Color } from "../src/index";

console.log("Start test: java");

const tree = parser.parse(code);

visualize(tree.cursor(), code);

console.log("With lineByLine");

visualize(tree.cursor(), code, { lineByLine: true });

console.log("With filter");

visualize(tree.cursor(), code, {
	filter(node) {
		if (node.name.endsWith("Comment"))
			return VisibilityModifier.Hidden;
		if (["ScopedIdentifier", "Modifiers"].indexOf(node.name) >= 0)
			return VisibilityModifier.Collapsed;
		return VisibilityModifier.Shown;
	}
});

console.log("Custom theme");

visualize(tree.cursor(), code, {
	theme: {
		...defaultTheme,
		name: Color.White,
		source: Color.Green,
	}
});
