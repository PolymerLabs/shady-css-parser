/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/**
 * This grammar is an aspirational description of the patterns that Shady CSS
 * Parser uses to match structures in stylesheets. It is intended to line up
 * closely with various versions of the official CSS grammar. However, it
 * generalizes rules in some cases (most notably when parsing AtRules), and in
 * other cases it skips parsing entirely to trade in low-utility structures for
 * a meaningful performance boost (most notably it does not deeply parse
 * ComplexSelectors or MediaQueryLists).
 *
 * [PEG.js][1] can be used to generate a parser from this grammar. The grammar
 * is not used to generate Shady CSS Parser. However, the grammar can be used to
 * generate a very similar parser that is useful for experimentation, analysis
 * and validation when developing and working with Shady CSS Parser.
 *
 * The syntax and semantics for the grammar are described [in the documentation
 * for PEG.js][2].
 *
 * 1: http://pegjs.org/
 * 2: http://pegjs.org/documentation#grammar-syntax-and-semantics
 */

Stylesheet
  = rules:(AtRule / Ruleset)*
  {
    return {
      type: 'stylesheet',
      rules: rules
    }
  }

AtRule
  = '@' name:Ident whitespace? params:([^{;]+) ruleset:('{' whitespace? Ruleset* '}')? delimiter?
  {
    return {
      type: 'atRule',
      name: name,
      params: params.join(''),
      rules: ruleset ? ruleset[2] : null
    };
  }
  / '@' name:Ident whitespace? rulelist:Rulelist?
  {
    return {
      type: 'atRule',
      name: name,
      params: null,
      rules: rulelist
    };
  }

Ruleset
  = selector:selector whitespace? rulelist:Rulelist whitespace?
  {
    return {
      type: 'ruleset',
      selector: selector,
      rulelist: rulelist
    };
  }


Rulelist
  = '{' whitespace? declarations:(Declaration (delimiter Declaration?)*)* '}' delimiter?
  {
    let rules = [];

    if (declarations[0] && declarations[0][0]) {
      rules.push(declarations[0][0]);
    }

    if (rules.length) {
      rules = rules.concat(
          declarations[0][1]
              .map(declaration => declaration[1])
              .filter(declaration => !!declaration));
    }

    return {
      type: 'rulelist',
      rules: rules
    };
  }

Declaration
  = name:Ident colon expression:Expression*
  {
    return {
      type: 'declaration',
      name: name,
      expression: expression
    };
  }
  / AtRule

Expression
  = terms:Term+
  {
    return {
      type: 'expression',
      terms: terms
    };
  }

Term
  = term:(Function / Value / Operator) whitespace?
  {
    return term;
  }

Function
  = name:Ident '(' expression:Expression? ')'
  {
    return {
      type: 'function',
      name: name,
      expression: expression
    };
  }

Value
  = value:(Ident / string / dimension)
  {
    return {
      type: 'value',
      value: value
    };
  }

Ident
  = ident:('-'? '-'? word ('-' word)*)
  {
    return (ident[0] || '') +
        (ident[1] || '') +
        ident[2] +
        ident[3].map(
            extra => extra.join('')).join('');
  }

Operator
  = character:operator
  {
    return {
      type: 'operator',
      character: character
    };
  }

selector
  = selector:[^{]+
  { return selector.join(''); }

word
  = chars:[^\(\)\{\}'"@;: \t\n\r+-\/*,]+
  {
    return chars.join('');
  }

dimension
  = value:number unit:word
  {
    return value + unit;
  }

number
  = digits:digit+
  {
    return digits.join('');
  }

colon
  = whitespace? colon:':' whitespace?
  { return colon; }

delimiter
  = whitespace? delimiter:';' whitespace?
  { return delimiter; }

string
  = '"' content:('\\"' / [^\"])* '"'
  { return '"' + content.join('') + '"'; }
  / '\'' ('\\\'' / [^\'])* '\''
  { return '\'' + content.join('') + '\''; }

digit
  = [0-9]

operator
  = [+-\/*:,]

boundary
  = [\(\)\{\}'"@;:]
  / operator

whitespace
  = whitespace:([ \t\n\r]+)
  { return whitespace.join(''); }
