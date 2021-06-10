import { Color, PlatformColor } from "./color";

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
	 * @param bright Whether to use the brighter version.
	 */
	fg(color: Color, bright?: boolean): void;
	/**
	 * Sets the background color.
	 * @param color New color.
	 * @param bright Whether to use the brighter version.
	 */
	bg(color: Color, bright?: boolean): void;
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
	 * @returns The text content of this writer.
	 */
	toString(): string;
}

/**
 * A helper class for writing formatted strings.
 */
export class Writer implements IWriter {
	protected buffer: string = "";
	protected color: PlatformColor = {
		fg: null,
		bg: null,
		bright_fg: false,
		bright_bg: false,
		update_fg: false,
		update_bg: false,
	};

	/**
	 * Writes a color marker to the internal buffer.
	 * @virtual
	 */
	protected pushColor() { }
	
	public push(str: string) {
		this.pushColor();
		this.buffer += str;
		this.color.update_fg = false;
		this.color.update_bg = false;
	}
	public fg(color: Color, bright: boolean = false): void {
		if (this.color.fg !== color || this.color.bright_fg !== bright) {
			this.color.fg = color;
			this.color.bright_fg = bright;
			this.color.update_fg = true;
		}
	}
	public bg(color: Color, bright: boolean = true): void {
		if (this.color.bg !== color || this.color.bright_bg !== bright) {
			this.color.bg = color;
			this.color.bright_bg = bright;
			this.color.update_bg = true;
		}
	}
	public resetColor(fg: boolean = true, bg: boolean = true) {
		if (fg && ((this.color.fg !== null) != this.color.update_fg)) {
			this.color.fg = null;
			this.color.update_fg = true;
		}
		if (bg && ((this.color.bg !== null) != this.color.update_bg)) {
			this.color.bg = null;
			this.color.update_bg = true;
		}
	}
	public print(): void {
		console.log(this.buffer);
	}
	public toString(): string {
		return this.buffer;
	}
}

/**
 * Wrapper class for a {@link Writer} with indentation support.
 */
export class IndentedWriter implements IWriter {
	private _indent: number = 0;
	private _unit: string = "  ";
	private computedIndent: string = "";

	/**
	 * Creates a new indented writer.
	 * @param inner Writer to wrap.
	 * @param unit String to use per indentation level.
	 */
	public constructor(
		public readonly inner: Writer,
		unit?: string,
	) {
		if (unit) this.unit = unit;
	}

	public get indent(): number { return this._indent; }
	public get unit(): string { return this._unit; }

	public set indent(i: number) {
		this._indent = i;
		this.updateIndent();
	}
	public set unit(u: string) {
		this._unit = u;
		this.updateIndent();
	}
		
	private updateIndent() {
		this.computedIndent = "\n" + this._unit.repeat(this._indent);
	}

	public push(str: string): void {
		this.inner.push(str.replace(/\n/g, this.computedIndent));
	}
	public fg(color: Color, bright?: boolean): void {
		this.inner.fg(color, bright);
	}
	public bg(color: Color, bright?: boolean): void {
		this.inner.bg(color, bright);
	}
	public resetColor(fg?: boolean, bg?: boolean): void {
		this.inner.resetColor(fg, bg);
	}
	public print(): void {
		this.inner.print();
	}
	public toString(): string {
		return this.inner.toString();
	}
}