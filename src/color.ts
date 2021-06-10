export enum Color {
	Black = 0,
	Red = 1,
	Green = 2,
	Yellow = 3,
	Blue = 4,
	Magenta = 5,
	Cyan = 6,
	White = 7,
}

export type PlatformColor = {
	bg: Color | null;
	fg: Color | null;
	bright_fg: boolean;
	bright_bg: boolean;
	update_fg: boolean;
	update_bg: boolean;
};