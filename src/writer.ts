import { Color, ColorType, ColorState } from "./color";

export interface IWriter {
	/**
	 * Writes a string to the internal buffer.
	 * @sealed
	 * @param str String to write.
	 */
	push(str: string): void;
	/**
	 * Sets the foreground color.
	 * @param color New color.
	 */
	fg(color: ColorType): void;
	/**
	 * Sets the background color.
	 * @param color New color.
	 */
	bg(color: ColorType): void;
	/**
	 * Resets the current color to the default.
	 * @param fg Foreground color.
	 * @param bg Background color.
	 */
	resetColor(fg?: boolean, bg?: boolean): void;
	/**
	 * Prints the formatted content of this writer in the console.
	 */
	print(): void;
	/**
	 * Clears the internal buffer but keeps the current colors.
	 */
	clear(): void
	/**
	 * @returns The text content of this writer.
	 */
	toString(): string;
}

/**
 * A helper class for writing formatted strings.
 */
export class Writer implements IWriter {
	protected buffer: string = "";
	protected color: ColorState = {
		fg: null,
		bg: null,
		update_fg: false,
		update_bg: false,
	};

	/**
	 * Writes a color marker to the internal buffer.
	 * @virtual
	 */
	protected pushColor() { }
	
	/** @inheritdoc IWriter.push */
	public push(str: string) {
		this.pushColor();
		this.buffer += str;
		this.color.update_fg = false;
		this.color.update_bg = false;
	}
	/** @inheritdoc IWriter.fg */
	public fg(color: ColorType): void {
		if (!Color.fastEquals(this.color.fg, color)) {
			this.color.fg = color;
			this.color.update_fg = true;
		}
	}
	/** @inheritdoc IWriter.bg */
	public bg(color: ColorType): void {
		if (!Color.fastEquals(this.color.bg, color)) {
			this.color.bg = color;
			this.color.update_bg = true;
		}
	}
	/** @inheritdoc IWriter.resetColor */
	public resetColor(fg: boolean = true, bg: boolean = true) {
		if (fg && ((this.color.fg !== null) !== this.color.update_fg)) {
			this.color.fg = null;
			this.color.update_fg = true;
		}
		if (bg && ((this.color.bg !== null) !== this.color.update_bg)) {
			this.color.bg = null;
			this.color.update_bg = true;
		}
	}
	/** @inheritdoc IWriter.print */
	public print(): void {
		console.log(this.buffer);
	}
	/** @inheritdoc IWriter.clear */
	public clear(): void {
		this.buffer = "";
		this.color.update_bg = true;
		this.color.update_fg = true;
	}
	/** @inheritdoc IWriter.toString */
	public toString(): string {
		return this.buffer;
	}
}