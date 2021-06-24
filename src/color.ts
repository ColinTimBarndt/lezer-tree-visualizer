/**
 * The Visual Studio Code console colors.
 */
const VSCColor = {
	Black: <ColorType>{ rgb: [0, 0, 0] },
	DarkRed: <ColorType>{ rgb: [205, 49, 49] },
	DarkGreen: <ColorType>{ rgb: [13, 188, 121] },
	DarkYellow: <ColorType>{ rgb: [229, 229, 16] },
	DarkBlue: <ColorType>{ rgb: [36, 114, 200] },
	DarkMagenta: <ColorType>{ rgb: [188, 63, 188] },
	DarkCyan: <ColorType>{ rgb: [17, 168, 205] },
	LightGray: <ColorType>{ rgb: [229, 229, 229] },
	DarkGray: <ColorType>{ rgb: [102, 102, 102] },
	Red: <ColorType>{ rgb: [241, 76, 76] },
	Green: <ColorType>{ rgb: [35, 209, 139] },
	Yellow: <ColorType>{ rgb: [245, 245, 67] },
	Blue: <ColorType>{ rgb: [59, 142, 234] },
	Magenta: <ColorType>{ rgb: [214, 112, 214] },
	BrightCyan: <ColorType>{ rgb: [41, 184, 219] },
	White: <ColorType>{ rgb: [229, 229, 229 ] },
} as const;
/**
 * Default terminal colors (4-bit) and helper functions.
 */
export const Color = {
	Black: <ColorType4bit>0,
	DarkRed: <ColorType4bit>1,
	DarkGreen: <ColorType4bit>2,
	DarkYellow: <ColorType4bit>3,
	DarkBlue: <ColorType4bit>4,
	DarkMagenta: <ColorType4bit>5,
	DarkCyan: <ColorType4bit>6,
	LightGray: <ColorType4bit>7,
	DarkGray: <ColorType4bit>8,
	Red: <ColorType4bit>9,
	Green: <ColorType4bit>10,
	Yellow: <ColorType4bit>11,
	Blue: <ColorType4bit>12,
	Magenta: <ColorType4bit>13,
	BrightCyan: <ColorType4bit>14,
	White: <ColorType4bit>15,
	vsc: VSCColor,
	/**
	 * @param color Any color to convert to RGB.
	 * @returns The color in RGB format.
	 */
	toRGB(color: ColorType): RGB {
		switch (typeof color) {
			case "number":
				return palette4bit[color];
			case "object":
				if (color instanceof Array) {
					let byte = color[1];
					if (byte < 16) return palette4bit[byte];
					if (byte >= 232) {
						const shade = shade24[byte - 232];
						return [shade, shade, shade];
					}
					byte -= 16;
					// 6x6x6 cube
					return [
						shade6[Math.floor(byte / 36)],
						shade6[(Math.floor(byte / 6) % 6)],
						shade6[byte % 6],
					];
				} else return color.rgb;
		}
	},
	/**
	 * @see {@link https://en.wikipedia.org/wiki/ANSI_escape_code#3-bit_and_4-bit}
	 * @param color4bit 4-bit input color.
	 * @returns 3-bit output color and the lost bright color bit.
	 */
	to3bit(color4bit: ColorType4bit): [ColorType3bit, boolean] {
		return [(color4bit % 8) as ColorType3bit, color4bit >= 8];
	},
	/**
	 * Compares two colors of the same color format. If the color format is
	 * different, eg. 4-bit and 8-bit, `false` is always returned.
	 * @param a First color.
	 * @param b Second color.
	 * @returns Whether both colors are equal.
	 */
	fastEquals(a: ColorType | null, b: ColorType | null): boolean {
		const ta = typeof a;
		const tb = typeof b;
		if (ta !== tb) return false;
		if (ta === "number") return a === b;
		if (a === null && b === null) return true;
		if (a === null || b === null) return false;
		if (a instanceof Array) {
			if (b instanceof Array)
				return a[1] === b[1];
			return false;
		}
		if (b instanceof Array) return false;
		//@ts-ignore
		return a.rgb[0] === b.rgb[0]
			//@ts-ignore
			&& a.rgb[1] === b.rgb[1]
			//@ts-ignore
			&& a.rgb[2] === b.rgb[2];
	}
} as const;

const palette4bit: RGB[] = [
	// Dark
	[0, 0, 0],
	[128, 0, 0],
	[0, 128, 0],
	[128, 128, 0],
	[0, 0, 128],
	[128, 0, 128],
	[0, 128, 128],
	[192, 192, 192],
	// Bright
	[128, 128, 128],
	[255, 0, 0],
	[0, 255, 0],
	[255, 255, 0],
	[0, 0, 255],
	[255, 0, 255],
	[0, 255, 255],
	[255, 255, 255],
];
const shadeN = (N: number) => {
	const buffer = new Uint8Array(N);
	let i;
	for (i = 0; i < N; i++)
		buffer[i] = Math.round(i * (255 / (N - 1)));
	return buffer;
};
const shade24 = shadeN(24);
const shade6 = shadeN(6);

/**
 * Type of a 3-bit color (7 colors).
 * @see {@link https://en.wikipedia.org/wiki/ANSI_escape_code#3-bit_and_4-bit}
 */
export type ColorType3bit =
	0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
/**
 * Type of a 4-bit color (7 colors with a brightness bit).
 * @see {@link https://en.wikipedia.org/wiki/ANSI_escape_code#3-bit_and_4-bit}
 */
export type ColorType4bit =
	ColorType3bit | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
/**
 * Type of an 8-bit color.
 * @see {@link https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit}
 */
export type ColorType8bit = [5, number];
/**
 * Type of a 24-bit RGB color.
 */
export type RGB = [number, number, number];
export type ColorType =
	ColorType4bit
	// 8-bit color
	| ColorType8bit
	| { rgb: RGB; };

/**
 * Used by the {@link Writer} to store the currently selected colors.
 */
export type ColorState = {
	bg: ColorType | null;
	fg: ColorType | null;
	update_fg: boolean;
	update_bg: boolean;
};