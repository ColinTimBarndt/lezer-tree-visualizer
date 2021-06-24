import { OsColorWriter } from "./os-color";
import { WebColorWriter } from "./web-color";

export const ColorWriter = typeof process === 'object' ? OsColorWriter : WebColorWriter;
export { OsColorWriter } from "./os-color";
export { WebColorWriter } from "./web-color";