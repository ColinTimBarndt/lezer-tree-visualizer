import { Color, PlatformColor } from "./color";
import { Writer } from "./writer";

function colorId(color: Color, bg: boolean, bright: boolean): string {
	return color + (bright ? 90 : 30) + (bg ? 10 : 0) + "";
}

export class ColorWriter extends Writer {
	public push(str: string) {
		const lines = str.split("\n");
		let i: number;
		for (i = 0; i < lines.length - 1; i++) {
			super.push(lines[i]);
			if (this.color.bg === null) {
				this.buffer += "\n";
			} else {
				this.buffer += "\x1b[0m\n";
				this.color.update_fg = true;
				this.color.update_bg = true;
			}
		}
		super.push(lines[i]);
	}
	protected pushColor() {
		const { update_fg, update_bg } = this.color;
		if (!(update_fg || update_bg)) return;
		const codes: string[] = [];

		if (update_fg && this.color.fg !== null) {
			codes.push(colorId(this.color.fg, false, this.color.bright_fg));
		}
		if (update_bg && this.color.bg !== null) {
			codes.push(colorId(this.color.bg, true, this.color.bright_bg));
		}
		if (this.color.fg === null && this.color.bg === null) {
			codes.push("0");
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
	 * @inheritdoc Writer.print
	 * @override
	 */
	public print() {
		console.log(this.buffer + "\x1b[0m");
	}
}