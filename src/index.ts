import { Tree, TreeCursor } from "lezer-tree";
import { Color } from "./color";
import { ColorWriter } from "./platform-color";
import { IndentedWriter, Writer } from "./writer";

export interface Options {
	/**
	 * Whether to use console colors.
	 * @defaultValue true
	 */
	colors?: boolean;
	/**
	 * Which string to use per indentation level.
	 * @defaultValue "│ "
	 */
	indentWith?: string;
}
/**
 * An object that can be used as a source must have the `substring` method.
 */
interface Source {
	substring(from: number, to: number): string;
};

/**
 * Visualizes a syntax tree (or node) by printing it in the console.
 * @param cursor Lezer tree cursor.
 * @param src Source code of the tree.
 * @param options Output options.
 */
export function visualize(cursor: TreeCursor, src: Source, options: Options = {}): void {
	const writer: Writer = options.colors ?? true
		? new ColorWriter()
		: new Writer();
	
	traverseNode(cursor, src, new IndentedWriter(writer, options.indentWith ?? "│ "), true);

	writer.print();
}
/**
 * Returns a visual representation of a syntax tree as a string.
 * @param cursor Lezer tree cursor.
 * @param src Source code of the tree.
 * @param options Output options. Colors are always off.
 */
export function visualizeString(cursor: TreeCursor, src: Source, options: Options = {}): string {
	const writer = new Writer();

	traverseNode(cursor, src, new IndentedWriter(writer, options.indentWith ?? "│ "), true);

	return writer.toString();
}

function traverseNode(cursor: TreeCursor, src: Source, writer: IndentedWriter, first: boolean = false) {
	if (!first) {
		writer.fg(Color.Black, true);
		writer.push("\n");
	}
	const nodeName = cursor.node.name;
	if (cursor.firstChild()) {
		
		writer.fg(Color.Cyan, true);
		writer.push(nodeName);

		writer.fg(Color.White, false);
		writer.push(":");
		writer.indent++;
		do {
			traverseNode(cursor, src, writer);
		} while (cursor.nextSibling())
		writer.indent--;
		cursor.parent();
		return;
	} else {
		const content = src.substring(cursor.from, cursor.to);
		const multiline = content.indexOf("\n") >= 0;
		if (content === nodeName && !multiline) {
			writer.fg(Color.Yellow, false);
			writer.push(content);
			return;
		} else {
			writer.fg(Color.Cyan, true);
			writer.push(nodeName);
			writer.fg(Color.White, false);
			if (multiline) {
				writer.indent++;
				writer.push(": '''");
				writer.fg(Color.Black, true);
				writer.push("\n");
				content.split("\n").forEach(line => {
					writer.fg(Color.Yellow, false);
					writer.push(line);
					writer.fg(Color.Black, true);
					writer.push("\n");
				});
				writer.fg(Color.White, false);
				writer.push("'''");
				writer.indent--;
				return;
			} else {
				writer.push(": '");
				writer.fg(Color.Yellow, false);
				writer.push(content);
				writer.fg(Color.White, false);
				writer.push("'");
				return;
			}
		}
	}
}