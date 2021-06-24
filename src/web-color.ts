import { Color, ColorType } from "./color";
import { Writer } from "./writer";

function colorStyle(color: ColorType, bg: boolean): string {
	const rgb = Color.toRGB(color);
	return (bg ? "background:" : "color:")
		+ "rgb("
		+ rgb.join(",")
		+ ");";
}

/**
 * Writes to the console with CSS format specifiers to support web console colors.
 */
export class WebColorWriter extends Writer {
	/**
	 * CSS Styles appended to the `console.log` call.
	 */
	protected styles: string[] = [];

	/**
	 * @inheritdoc IWriter.pushColor
	 * @override
	 */
	protected pushColor() {
		const style: string[] = [];

		if (this.color.fg !== null) {
			style.push(colorStyle(this.color.fg, false));
		}
		if (this.color.bg !== null) {
			style.push(colorStyle(this.color.bg, true));
		}

		this.buffer += "%c";
		this.styles.push(style.join(";"));
	}

	/**
	 * @inheritdoc IWriter.print
	 * @override
	 */
	public print() {
		console.log(this.buffer, ...this.styles);
	}

	/**
	 * @inheritdoc IWriter.clear
	 * @override
	 */
	public clear() {
		super.clear();
		this.styles.length = 0;
	}
}