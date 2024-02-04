/**
 * @license
 * Copyright (c) 2022 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {getChildren} from './ast-iterator';
import {Node} from './common';

/**
 * @returns An array of nodes whose range encompases the given location.
 * The nodes go from less to more specific, and each node after the first is a
 * child of its predecessor.
 */
export function getNodesAtLocation(
  initialNode: Node,
  location: number,
  path: Node[] = [],
): Node[] {
  let current = initialNode;
  outer: while (true) {
    for (const child of getChildren(current)) {
      if (contains(child, location)) {
        path.push(child);
        current = child;
        continue outer;
      }
    }
    // no children found that contain the location, so we can go no deeper.
    break;
  }
  return path;
}

function contains(node: Node, location: number) {
  return location >= node.range.start && location < node.range.end;
}
