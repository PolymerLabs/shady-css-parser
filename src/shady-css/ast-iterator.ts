/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {Node, nodeType} from './common';

export function* iterateOverAst(node: Node): Iterable<Node> {
  yield node;
  for (const child of getChildren(node)) {
    yield* iterateOverAst(child);
  }
}

export function* getChildren(node: Node) {
  switch (node.type) {
    case nodeType.stylesheet:
      yield* node.rules;
      return;
    case nodeType.ruleset:
      yield node.rulelist;
      return;
    case nodeType.rulelist:
      yield* node.rules;
      return;
    case nodeType.declaration:
      if (node.value != null) {
        yield node.value;
      }
      return;
    case nodeType.atRule:
      if (node.rulelist != null) {
        yield node.rulelist;
      }
      return;
    case nodeType.expression:
    case nodeType.comment:
    case nodeType.discarded:
      return;  // no child nodes
    default:
      const never: never = node;
      console.error(`Got a node of unknown type: ${never}`);
  }
}
