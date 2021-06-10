import { Color, PlatformColor } from "./color";
import { Writer } from "./writer";

const colorHex: string[] = [
	// Normal
	[12, 12, 12],
	[197, 15, 31],
	[19, 161, 14],
	[193, 156, 0],
	[0, 55, 218],
	[136, 23, 152],
	[58, 150, 221],
	[204, 204, 204],
	// Bright
	[118, 118, 118],
	[231, 72, 86],
	[22, 198, 12],
	[249, 241, 165],
	[59, 129, 255],
	[180, 0, 158],
	[97, 214, 214],
	[242, 242, 242],
].map((rgb) => `rgb(${rgb.join(",")})`);

function colorStyle(color: Color, bg: boolean, bright: boolean): string {
	return (bg ? "background:" : "color:")
		+ colorHex[color + (bright ? 8 : 0)]
		+ ";";
}

export class ColorWriter extends Writer {
	protected styles: string[] = [];

	/**
	 * @inheritdoc Writer.pushColor
	 * @override
	 */
	protected pushColor() {
		const style: string[] = [];

		if (this.color.fg !== null) {
			style.push(colorStyle(this.color.fg, false, this.color.bright_fg));
		}
		if (this.color.bg !== null) {
			style.push(colorStyle(this.color.bg, true, this.color.bright_bg));
		}

		this.buffer += "%c";
		this.styles.push(style.join(";"));
	}

	/**
	 * @inheritdoc Writer.print
	 * @override
	 */
	public print() {
		console.log(this.buffer, ...this.styles);
	}
}