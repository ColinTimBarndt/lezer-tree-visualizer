// @ts-ignore
import code from "./Test.java";
import { parser } from "lezer-java";
import { visualize } from "../src/index";

console.log("Start test: java");

const tree = parser.parse(code);

visualize(tree.cursor(), code);