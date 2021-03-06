# lezer-tree-visualizer

[![CodeMirror 6](https://img.shields.io/badge/CodeMirror-6-informational?logo=CodeMirror)](https://codemirror.net/6/)
[![Documentation](https://img.shields.io/badge/-Documentation-informational?logo=typescript&logoColor=white)](https://colintimbarndt.github.io/lezer-tree-visualizer/)
[![npm (scoped)](https://img.shields.io/npm/v/@colin_t/lezer-tree-visualizer)](https://www.npmjs.com/package/@colin_t/lezer-tree-visualizer)

A basic tool for debugging syntax trees by visualizing them. This module
exports two functions, one for directly printing to the console and another
one for storing the formatted string (without color formatting).

This modules supports both native consoles and the web. This library detects
if it is run in the browser or Node.

## Example

This is a simple Java program which can be parsed with `lezer-java`:

```java
package tests;

import java.lang.String;

/**
 * Test
 */
public class Test {
  public static void main(String[] args) {
    System.out.println("Hello world!");
  }
}
```

When printing the syntax tree to the console:

[![Java Tree](https://raw.githubusercontent.com/ColinTimBarndt/lezer-tree-visualizer/master/img/java-tree.png)](https://github.com/ColinTimBarndt/lezer-tree-visualizer/blob/master/img/java-tree.png)
