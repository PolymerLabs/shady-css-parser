import { matcher, tokenType } from './common';
import { lex } from './lexer';

function Selector(tokens, index) {
  let token = tokens[index];
  let combinator = '';
  let block = null;

  while (!matcher.blockBoundary.test(token[0])) {
    combinator += token[0];
    token = tokens[++index];
  }

  if (token[0] === '{') {
    token = Block(tokens, index);
    block = token[0];
    index = token[1];
  }

  token = Delimiter(tokens, index);
  index = token[1];

  return [{
    type: 'selector',
    combinator: combinator,
    block: block
  }, index];
}

function Value(tokens, index) {
  let token = tokens[index];
  let value = '';

  while (matcher.whitespace.test(token[0])) {
    token = tokens[++index];
  }

  if (token[0] === '{') {
    return Block(tokens, index);
  } else {
    while (!matcher.blockBoundary.test(token[0])) {
      value += token[0];
      token = tokens[++index];
    }
  }

  token = Delimiter(tokens, index);
  index = token[1];

  return [{
    type: 'value',
    value: value
  }, index];
}

function Property(tokens, index) {
  let token = tokens[index];
  let name = '';
  let value = null;

  while (!matcher.propertyBoundary.test(token[0])) {
    name += token[0];
    token = tokens[++index];
  }

  if (token[0] === ':') {
    token = Value(tokens, index + 1);
    value = token[0];
    index = token[1];
  }

  return [{
    type: 'property',
    name: name,
    value: value
  }, index];
}

function Rule(tokens, index) {
  let token = tokens[index];
  let start = index;

  while (!matcher.blockBoundary.test(token[0])) {
    token = tokens[++index];

    if (matcher.propertyDelimiter.test(token[0])) {
      return Property(tokens, start);
    }

    if (matcher.blockBoundary.test(token[0])) {
      return Selector(tokens, start);
    }
  }

  return ParseError(tokens, index, 'Failed to parse Rule starting with ' + tokens[start][0]);
}

function Delimiter(tokens, index) {
  let token = tokens[index];

  while (token && matcher.whitespace.test(token[0])) {
    token = tokens[++index];
  }

  if (token && token[0] === ';') {
    token = tokens[++index];
  }

  return [{
    type: 'delimiter',
    value: token ? token[0] : 'EOF'
  }, index];
}

function Block(tokens, index) {
  let token = tokens[++index];
  let statements = [];
  let statement;

  while (token && token[0] !== '}') {
    statement = Statement(tokens, index);
    if (statement[0] == null) {
      break;
    }

    statements.push(statement[0]);
    token = Delimiter(tokens, statement[1]);

    index = token[1];
    token = tokens[index];
  }

  token = Delimiter(tokens, index + 1);
  index = token[1];

  return [{
    type: 'block',
    statements: statements
  }, index];
}

function AtRule(tokens, index) {
  let token = tokens[index];
  let identifier = token[0];
  let value = '';
  let block;

  token = tokens[++index];

  if (token[1] !== tokenType.word) {
    return ParseError(tokens, index, 'At Rule missing identifier, got "' + token[0] + '" instead');
  }

  identifier += token[0];

  while ((token = tokens[++index]) && !matcher.blockBoundary.test(token[0])) {
    value += token[0];
  }

  if (token[0] === '{') {
    token = Block(tokens, index);
    block = token[0];
    index = token[1];
  }

  token = Delimiter(tokens, index);
  index = token[1];

  return [{
    type: 'at-rule',
    identifier: identifier,
    value: value,
    block: block
  }, index];
}

function Comment(tokens, index) {
  let token = tokens[index];
  let comment = token[0];

  while (!matcher.commentClose.test(token[0]) && (token = tokens[++index])) {
    comment += token[0];
  }

  return [{
    type: 'comment',
    value: comment
  }, index + 1];
}

function ParseError(tokens, index, error) {
  return [{
    type: 'parse-error',
    offset: tokens[index][2],
    error: error || ''
  }, index];
}

function Statement(tokens, index) {
  let token = tokens[index];

  while (token[1] === tokenType.whitespace) {
    token = tokens[++index];
  }

  if (matcher.commentOpen.test(token[0])) {
    return Comment(tokens, index);
  }

  if (token[0] === '@') {
    return AtRule(tokens, index);
  }

  if (token[1] === tokenType.word || token[1] === tokenType.boundary) {
    return Rule(tokens, index);
  }

  return [null, tokens.length];
}

function Stylesheet(tokens) {
  let lastIndex;
  let index = 0;
  let parsed = [];
  let statement;

  while (index < tokens.length) {
    statement = Statement(tokens, index);

    if (statement[0] != null) {
      parsed.push(statement[0]);
    }

    lastIndex = index;
    index = statement[1];

    if (index === lastIndex) {
      console.error('Infinite loop detected, breaking.');
      break;
    }
  }

  return parsed;
}

function parse(source) {
  return Stylesheet(lex(source));
}

export { parse };
