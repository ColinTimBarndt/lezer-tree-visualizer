import { Color } from "../src/color";
import { ColorWriter } from "../src/platform-color";

console.log("Start test: color");

const writer = new ColorWriter();

writer.fg(Color.Cyan);
writer.push("Cyan text\n");
writer.bg(Color.White);
writer.push("White background\n");
writer.fg(Color.White, true);
writer.bg(Color.Cyan, false);
writer.push("Cyan background\n");

writer.print();