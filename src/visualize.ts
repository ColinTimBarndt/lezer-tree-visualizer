import { TreeCursor, SyntaxNode } from "lezer-tree";
import { Color, ColorType } from "./color";
import { ColorWriter } from "./platform-color";
import { IWriter, Writer } from "./writer";

const [CH_V, CH_VR, CH_R, CH_E] = [
	"│ ",
	"├╴",
	"└╴",
	"  ",
];

export interface Theme {
	name: ColorType;
	source: ColorType;
	tree: ColorType;
	blockQuotes: ColorType;
	blockReturn: ColorType;
	colon: ColorType;
	ellipsis: ColorType;
}

/**
 * The default color theme for terminals.
 */
export const defaultOsTheme: Theme = {
	name: Color.BrightCyan,
	source: Color.DarkYellow,
	tree: Color.DarkGray,
	blockQuotes: Color.LightGray,
	blockReturn: Color.DarkGray,
	colon: Color.LightGray,
	ellipsis: Color.LightGray,
} as const;
/**
 * The default color theme for web consoles.
 */
export const defaultWebTheme: Theme = {
	name: Color.vsc.BrightCyan,
	source: Color.vsc.DarkYellow,
	tree: Color.vsc.DarkGray,
	blockQuotes: Color.vsc.LightGray,
	blockReturn: Color.vsc.DarkGray,
	colon: Color.vsc.LightGray,
	ellipsis: Color.vsc.LightGray,
} as const;

/**
 * The default color theme for the current platform.
 */
export const defaultTheme: Theme = typeof process === "object"
	? defaultOsTheme
	: defaultWebTheme;


/**
 * An object that can be used as a source must have the `substring` method.
 */
export interface Source {
	substring(from: number, to: number): string;
};

/**
 * @see {@link Options.filter}
 * @returns One of the following values:
 * 
 * |Value      |Description                                                   |
 * |-----------|--------------------------------------------------------------|
 * |`Hidden`   |The node is hidden                                            |
 * |`Shown`    |The node is visible                                           |
 * |`Collapsed`|Only the node name is visible, the rest remains as an ellipsis|
 */
export type FilterFunction = (node: SyntaxNode) => VisibilityModifierValue;

/**
 * @see {@link Options.filter}
 */
export const VisibilityModifier = {
	Hidden: 0,
	Shown: 1,
	Collapsed: 2,
} as const;
/**
 * @see {@link Options.filter}
 */
export type VisibilityModifierValue = typeof VisibilityModifier[keyof typeof VisibilityModifier];

export interface Options {
	/**
	 * Whether to use console colors.
	 * @defaultValue false
	 */
	colors?: boolean;
	/**
	 * Whether to log using only one call to `console.log` or one call for
	 * each line. This option often looks very ugly in the browser, but it might
	 * improve performance and memory usage for very large trees.
	 * @defaultValue false
	 */
	lineByLine?: boolean;
	/**
	 * A function by which nodes are filtered.
	 * @param node The node to be filtered.
	 */
	filter?: FilterFunction;
	/**
	 * Replaces the standard writer. The {@link Options.colors} option is
	 * ignored if set.
	 */
	writer?: IWriter;
	/**
	 * Overrides the {@link defaultTheme | default theme}.
	 */
	theme?: Theme;
}

type Generator2d<T, R = any> = Generator<Generator<T, void>, R>;

/**
 * Visualizes a syntax tree (or node) by printing it in the console.
 * @param cursor Lezer tree cursor.
 * @param src Source code of the tree.
 * @param colors 
 */
export function visualize(cursor: TreeCursor, src: Source, options: Options = {}) {
	const writer: IWriter = options.writer
		|| (options.colors ?? true
		? new ColorWriter()
		: new Writer());
	
	let seg,
		filter: FilterFunction = options.filter || (() => 1),
		theme: Theme = options.theme || defaultTheme;
	if (options.lineByLine) {
		let line;
		for (line of traverseNode(cursor, src, theme, filter)) {
			for (seg of line) {
				if (seg[1]) {
					if (seg[1] === -1)
						writer.resetColor(true, false);
					else
						writer.fg(seg[1]);
				}
				writer.push(seg[0]);
			}
			writer.print();
			writer.clear();
		}
	} else {
		for (seg of joinAll(
			traverseNode(cursor, src, theme, filter),
			["\n", undefined],
		)) {
			if (seg[1]) {
				if (seg[1] === -1)
					writer.resetColor(true, false);
				else
					writer.fg(seg[1]);
			}
			writer.push(seg[0]);
		}
		writer.print();
	}
}

function* traverseNode(
	cursor: TreeCursor,
	src: Source,
	theme: Theme,
	filter: FilterFunction,
): Generator2d<[string, ColorType | -1 | undefined], void> {
	const nodeName = cursor.node.name;
	switch (filter(cursor.node)) {
		case 2:
			yield list(
				[nodeName,  theme.name],
				[": ",  theme.colon],
				["…",  theme.ellipsis],
			);
		case 0:
			return;
	}
	if (cursor.firstChild()) {
		yield list(
			[nodeName,  theme.name],
			[":",  theme.colon],
		);
		let line, hasNext;
		do {
			hasNext = cursor.node.nextSibling;
			for (line of prefix2d(
				traverseNode(cursor, src, theme, filter),
				[hasNext ? CH_VR : CH_R,  theme.tree],
				[hasNext ? CH_V : CH_E,  theme.tree],
			)) yield line;
		} while (cursor.nextSibling())
		cursor.parent();
	} else {
		const nodeText = src.substring(cursor.from, cursor.to);
		if (nodeText === nodeName) {
			yield list([nodeName,  theme.source]);
		} else {
			if (nodeText.indexOf("\n") < 0)
				yield list(
					[nodeName,  theme.name],
					[": ",  theme.colon],
					[nodeText,  theme.source],
				);
			else {
				yield list(
					[nodeName,  theme.name],
					[": ",  theme.colon],
					["'''",  theme.blockQuotes],
				);
				let i = 0,
					lines = nodeText.split(/\r?\n/g),
					end = lines.length - 1;
				for (; i < end; i++)
					yield list(
						[CH_E + lines[i],  theme.source],
						["⮐",  theme.blockReturn],
					);
				if (end >= 0)
					yield list([CH_E + lines[i],  theme.source]);
				yield list(["  '''",  theme.blockQuotes]);
			}
		}
	}

}

function* list<T>(...items: T[]): Generator<T, void> {
	let i = 0;
	let l = items.length;
	for (; i < l; i++) yield items[i];
}

function* joinAll<T>(gen: Generator2d<T>, sep: T): Generator<T, void> {
	let item, value;
	item = gen.next();
	if (!item.done) for (value of item.value) yield value;
	while (item = gen.next(), !item.done) {
		yield sep;
		for (value of item.value) yield value;
	}
}

function* prefix2d<T, R>(
	base: Generator2d<T, R>,
	first: T,
	mid: T,
): Generator2d<T, R> {
	let item = base.next();
	if (!item.done) yield prefix(first, item.value);
	while (item = base.next(), !item.done)
		yield prefix(mid, item.value);
	return item.value;
}

function* prefix<T, R>(
	pre: T,
	rest: Generator<T, R>,
): Generator<T, R> {
	yield pre;
	let item;
	while (item = rest.next(), !item.done)
		yield item.value;
	return item.value;
}