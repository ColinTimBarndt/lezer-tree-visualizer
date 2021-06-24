import { Color, ColorType } from "./color";
import { Writer } from "./writer";

function colorId(color: ColorType, bg: boolean): string {
	if (typeof color === "number") {
		const [three, bright] = Color.to3bit(color);
		return three + (bright ? 90 : 30) + (bg ? 10 : 0) + "";
	}
	if (color instanceof Array) {
		return (bg ? "48;" : "38;") + color.join(";");
	}
	return (bg ? "48;2;" : "38;2;") + color.rgb.join(";");
}

/**
 * Writes to the console with ANSI escape codes to support terminal colors.
 * @see {@link https://en.wikipedia.org/wiki/ANSI_escape_code#Colors}
 */
export class OsColorWriter extends Writer {
	/**
	 * @inheritdoc IWriter.push
	 * @override
	 */
	public push(str: string) {
		const lines = str.split("\n");
		let i: number;
		for (i = 0; i < lines.length - 1; i++) {
			super.push(lines[i]);
			if (this.color.bg === null) {
				this.buffer += "\n";
			} else {
				this.buffer += "\x1b[m\n";
				this.color.update_fg = true;
				this.color.update_bg = true;
			}
		}
		super.push(lines[i]);
	}
	/**
	 * @inheritdoc IWriter.pushColor
	 * @override
	 */
	protected pushColor() {
		const { update_fg, update_bg } = this.color;
		if (!(update_fg || update_bg)) return;
		const codes: string[] = [];

		if (update_fg && this.color.fg !== null) {
			codes.push(colorId(this.color.fg, false));
		}
		if (update_bg && this.color.bg !== null) {
			codes.push(colorId(this.color.bg, true));
		}
		if (this.color.fg === null && this.color.bg === null) {
			codes.push("");
		} else {
			if (update_fg && this.color.fg === null) {
				codes.push("39");
			}
			if (update_bg && this.color.bg === null) {
				codes.push("49");
			}
		}

		this.buffer += "\x1b[";
		this.buffer += codes.join(";");
		this.buffer += "m";
	}

	/**
	 * @inheritdoc IWriter.print
	 * @override
	 */
	public print() {
		console.log(this.buffer + "\x1b[m");
	}
}