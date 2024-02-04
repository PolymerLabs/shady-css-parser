/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */

/**
 * Like NodeFactory, only doesn't care about ranges, or types.
 */
import {nodeType} from '../shady-css';

// tslint:disable:no-any

export class TestNodeFactory {
  stylesheet(rules: any[]): any {
    return {type: nodeType.stylesheet, rules};
  }

  atRule(
    name: string,
    parameters: string,
    rulelist: any | undefined = undefined,
  ): any {
    return {type: nodeType.atRule, name, parameters, rulelist};
  }

  comment(value: string): any {
    return {type: nodeType.comment, value};
  }

  rulelist(rules: any[]): any {
    return {type: nodeType.rulelist, rules};
  }

  ruleset(selector: string, rulelist: any): any {
    return {type: nodeType.ruleset, selector, rulelist};
  }

  declaration(name: string, value: any | undefined): any {
    return {type: nodeType.declaration, name, value};
  }
  expression(text: string): any {
    return {type: nodeType.expression, text};
  }

  discarded(text: string): any {
    return {type: nodeType.discarded, text};
  }
}
