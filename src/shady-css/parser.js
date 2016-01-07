import { matcher, tokenType } from './common';
import { TokenCursor } from './token-cursor';
import { Lexer } from './lexer';
import { NodeFactory } from './node-factory';

class Parser {
  constructor(nodeFactory = new NodeFactory()) {
    this.nodeFactory = nodeFactory;
  }

  parse(cssText) {
    return this.parseStylesheet(new TokenCursor(new Lexer(cssText)));
  }

  parseStylesheet(tokenCursor) {
    let declarations = [];
    let declaration;

    while (tokenCursor.next &&
           (declaration = this.parseDeclaration(tokenCursor))) {
      declarations.push(declaration);
    }

    return this.nodeFactory.stylesheet(declarations);
  }

  parseDeclaration(tokenCursor) {
    // Consume all leading (presumably insignificant) whitespace:
    this.traverseWhitespace(tokenCursor);

    if (tokenCursor.next) {
      // Test for a comment opening. Take a comment as necessary:
      if (matcher.commentOpen.test(tokenCursor.next.text)) {
        return this.parseComment(tokenCursor);
      }

      // Check for an At Rule:
      if (tokenCursor.next.text === '@') {
        return this.parseAtRule(tokenCursor);
      }

      // Everything else is assumed to be a Rule (a Property or a Selector).
      // Make sure we didn't land on an untaken delimiter or an unbalanced
      // brace.
      if (!matcher.propertyDelimiter.test(tokenCursor.next.text) &&
          (tokenCursor.next.type === tokenType.word ||
           tokenCursor.next.type === tokenType.boundary)) {
        return this.parseRule(tokenCursor);
      }

      // Otherwise we handle unknown syntax to the next boundary:
      return this.parseUnknown(tokenCursor);
    }

    // Preferring a default return of `null` for consistency, this implies
    // that we have exhausted our tokens:
    return null;
  }

  parseComment(tokenCursor) {
    let comment = '';

    while (tokenCursor.next) {
      let token = tokenCursor.takeOne();
      comment += token.text;

      if (matcher.commentClose.test(token.text)) {
        break;
      }
    }

    return this.nodeFactory.comment(comment)
  }

  parseUnknown(tokenCursor) {
    let unknown = '';

    while (tokenCursor.next) {
      let token = tokenCursor.takeOne();

      unknown += token.text;

      if (token && token.type === tokenType.boundary) {
        break;
      }
    }

    unknown += this.traverseDelimiter(tokenCursor);

    return this.nodeFactory.discarded(unknown);
  }

  parseAtRule(tokenCursor) {
    let whitespace = '';
    let name = '';
    let parameters = '';
    let block;

    while (tokenCursor.next) {
      if (tokenCursor.next.type === tokenType.whitespace) {
        whitespace = this.traverseWhitespace(tokenCursor);
      } else if (!name && tokenCursor.next.text === '@') {
        tokenCursor.takeOne();

        while (tokenCursor.next &&
               tokenCursor.next.type !== tokenType.boundary &&
               tokenCursor.next.type !== tokenType.whitespace) {
          name += tokenCursor.takeOne().text;
        }
      } else if (tokenCursor.next.text === '{') {
        block = this.parseBlock(tokenCursor);
        break;
      } else if (matcher.propertyDelimiter.test(tokenCursor.next.text)) {
        // TODO: why not take one?
        this.traverseDelimiter(tokenCursor);
        break;
      } else {
        if (whitespace && parameters) {
          parameters += whitespace;
        }
        whitespace = '';
        parameters += tokenCursor.takeOne().text;
      }
    }

    return this.nodeFactory.atRule(name, parameters, block);
  }

  parseBlock(tokenCursor) {
    let declarations = [];

    // Take the opening { boundary:
    tokenCursor.takeOne();

    while (tokenCursor.next) {
      if (tokenCursor.next.type === tokenType.whitespace) {
        this.traverseWhitespace(tokenCursor);
      } else if (tokenCursor.next.text === '}') {
        // Take the closing } boundary:
        tokenCursor.takeOne();
        break;
      } else {
        let declaration = this.parseDeclaration(tokenCursor);
        if (declaration == null) {
          break;
        }
        declarations.push(declaration);
      }
    }

    return this.nodeFactory.block(declarations);
  }

  parseRule(tokenCursor) {
    let rule = '';
    let whitespace = '';

    while (tokenCursor.next) {
      if (tokenCursor.next.type === tokenType.whitespace) {
        whitespace = this.traverseWhitespace(tokenCursor);
      } else if (tokenCursor.next.text === '(') {
        rule += this.traverseCall(tokenCursor);
      } else if (matcher.blockBoundary.test(tokenCursor.next.text)) {
        break;
      } else {
        if (whitespace && rule) {
          rule += whitespace;
        }
        whitespace = '';
        rule += tokenCursor.takeOne().text;
      }
    }

    // A selector never contains or ends with a semi-colon.
    if (matcher.propertyDelimiter.test(tokenCursor.next.text)) {
      let colonIndex = rule.indexOf(':');
      let value = rule.substr(colonIndex + 1).replace(/^\s*/, '');

      this.traverseDelimiter(tokenCursor);

      return this.nodeFactory.property(
          rule.substr(0, colonIndex),
          this.nodeFactory.propertyValue(value));
    } else if (matcher.propertyNameTrail.test(rule)) {
      let block = this.parseBlock(tokenCursor);

      this.traverseDelimiter(tokenCursor);

      return this.nodeFactory.property(rule.substr(0, rule.length - 1), block);
    } else {
      return this.nodeFactory.selector(rule, this.parseBlock(tokenCursor));
    }
  }

  traverseCall(tokenCursor) {
    let call = '';

    if (tokenCursor.next.text === '(') {
      while (tokenCursor.next.text !== ')') {
        call += tokenCursor.takeOne().text;
      }
    }

    return call;
  }

  traverseWhitespace(tokenCursor) {
    let whitespace = '';

    while (tokenCursor.next &&
           tokenCursor.next.type === tokenType.whitespace) {
      whitespace += tokenCursor.takeOne().text;
    }

    return whitespace;
  }

  traverseDelimiter(tokenCursor) {
    let trail = this.traverseWhitespace(tokenCursor);

    if (tokenCursor.next && tokenCursor.next.text === ';') {
      trail += tokenCursor.takeOne().text;
    }

    return trail;
  }
}

export { Parser };
