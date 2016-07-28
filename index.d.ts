export class Parser {
  parse(cssText: string): Stylesheet;
}
export type Node =
    Stylesheet | AtRule | Comment | Rulelist | Ruleset | Declaration |
    Expression | Discarded;
export type Rule = Comment | AtRule | Ruleset | Declaration | Discarded;

export interface Stylesheet {
  type: 'stylesheet';
  /** The list of rules that appear at the top level of the stylesheet. */
  rules: Rule[];
}
export interface AtRule {
  type: 'atRule';
  /** The "name" of the At Rule (e.g., `charset`) */
  name: string;
  /** The "parameters" of the At Rule (e.g., `utf8`) */
  parameters: string;
  /** The Rulelist node (if any) of the At Rule. */
  rulelist?: Rulelist;
}
export interface Comment {
  type: 'comment';
  /**
   * The full text content of the comment, including opening and closing
   * comment signature.
   */
  value: string;
}
export interface Rulelist {
  type: 'rulelist';
  /** An array of the Rule nodes found within the Ruleset. */
  rules: Rule[];
}
export interface Ruleset {
  type: 'ruleset';
  /** The selector that corresponds to the Selector (e.g., `#foo > .bar`). */
  selector: string;
  /** The Rulelist node that corresponds to the Selector. */
  rulelist: Rulelist;
}
export interface Declaration {
  type: 'declaration';
  /** The property name of the Declaration (e.g., `color`). */
  name: string;
  value: Expression | Rulelist;
}
export interface Expression {
  type: 'expression';
  /** The full text content of the expression (e.g., `url(img.jpg)`) */
  text: string;
}
/**
 * Discarded nodes contain content that was not parseable (usually due to
 * typos, or otherwise unrecognized syntax).
 */
export interface Discarded {
  type: 'discarded';
  /** The text content that is discarded. */
  text: string;
}

export abstract class NodeVisitor<T> {
  readonly path: Node[];
  visit(node: Node): T;
  abstract stylesheet(stylesheet: Stylesheet): T;
  abstract atRule(atRule: AtRule): T;
  abstract comment(comment: Comment): T;
  abstract rulelist(rulelist: Rulelist): T;
  abstract ruleset(ruleset: Ruleset): T;
  abstract declaration(declaration: Declaration): T;
  abstract expression(expression: Expression): T;
  abstract discarded(discarded: Discarded): T;
}

export class Stringifier extends NodeVisitor<string> {
  stylesheet(stylesheet: Stylesheet): string;
  atRule(atRule: AtRule): string;
  comment(comment: Comment): string;
  rulelist(rulelist: Rulelist): string;
  ruleset(ruleset: Ruleset): string;
  declaration(declaration: Declaration): string;
  expression(expression: Expression): string;
  discarded(discarded: Discarded): string;
}



export class Token {
  type: Token.Type;
  start: number;
  end: number;
  /**
   * Create a Token instance.
   * @param type The lexical type of the Token.
   * @param start The start index of the text corresponding to the
   * Token in the CSS text.
   * @param end The end index of the text corresponding to the Token
   * in the CSS text.
   */
  constructor(type: Token.Type, start: number, end: number);

  /**
   * Test if the Token matches a given numeric type. Types match if the bitwise
   * AND of the Token's type and the argument type are equivalent to the
   * argument type.
   * @param type The numeric type to test for equivalency with the Token.
   */
  is(type: Token.Type): boolean;
}
export namespace Token {
  /**
   * An enumeration of Token types.
   */
  export enum Type {
    none = 0,
    whitespace = 1,
    string = 2,
    comment = 4,
    word = 8,
    boundary = 16,
    propertyBoundary = 32,
    // Special cases for boundary:
    openParenthesis = 64 | 16,
    closeParenthesis = 128 | 16,
    at = 256 | 16,
    openBrace = 512 | 16,
    // [};] are property boundaries:
    closeBrace = 1024 | 32 | 16,
    semicolon = 2048 | 32 | 16,
    // : is a chimaeric abomination:
    // foo:bar{}
    // foo:bar;
    colon = 4096 | 16 | 8
  }
}


export class Tokenizer {
  /**
   * Create a Tokenizer instance.
   * @param cssText The raw CSS string to be tokenized.
   */
  constructor(cssText: string);

  readonly offset: number;

  /**
   * The current token that will be returned by a call to `advance`. This
   * reference is useful for "peeking" at the next token ahead in the sequence.
   * If the entire CSS text has been tokenized, the `currentToken` will be null.
   */
  readonly currentToken: Token;

  /**
   * Advance the Tokenizer to the next token in the sequence.
   * @return The current token prior to the call to `advance`, or null
   * if the entire CSS text has been tokenized.
   */
  advance(): Token | null;

  /**
   * Extract a slice from the CSS text, using two tokens to represent the range
   * of text to be extracted. The extracted text will include all text between
   * the start index of the first token and the offset index of the second token
   * (or the offset index of the first token if the second is not provided).
   *
   * @param startToken The token that represents the beginning of the
   * text range to be extracted.
   * @param endToken The token that represents the end of the text range
   * to be extracted. Defaults to the startToken if no endToken is provided.
   * @return The substring of the CSS text corresponding to the
   * startToken and endToken.
   */
  slice(startToken: Token, endToken: Token): string;

  /**
   * Flush all tokens from the Tokenizer.
   * @return An array of all tokens corresponding to the CSS text.
   */
  flush(): Token[];

  /**
   * Tokenize a string starting at a given offset in the CSS text. A string is
   * any span of text that is wrapped by eclusively paired, non-escaped matching
   * quotation marks.
   *
   * @param offset An offset in the CSS text.
   * @return A string Token instance.
   */
  tokenizeString(offset: number): Token;

  /**
   * Tokenize a word starting at a given offset in the CSS text. A word is any
   * span of text that is not whitespace, is not a string, is not a comment and
   * is not a structural delimiter (such as braces and semicolon).
   *
   * @param offset An offset in the CSS text.
   * @return A word Token instance.
   */
  tokenizeWord(offset: number): Token;

  /**
   * Tokenize whitespace starting at a given offset in the CSS text. Whitespace
   * is any span of text made up of consecutive spaces, tabs, newlines and other
   * single whitespace characters.
   *
   * @param number An offset in the CSS text.
   * @return A whitespace Token instance.
   */
  tokenizeWhitespace(offset: number): Token;

  /**
   * Tokenize a comment starting at a given offset in the CSS text. A comment is
   * any span of text beginning with the two characters / and *, and ending with
   * a matching counterpart pair of consecurtive characters (* and /).
   *
   * @param offset An offset in the CSS text.
   * @return A comment Token instance.
   */
  tokenizeComment(offset: number): Token;

  /**
   * Tokenize a boundary at a given offset in the CSS text. A boundary is any
   * single structurally significant character. These characters include braces,
   * semicolons, the "at" symbol and others.
   *
   * @param offset An offset in the CSS text.
   * @return A boundary Token instance.
   */
  tokenizeBoundary(offset: number): Token;
}

 /**
 * An enumeration of Node types.
 * @constant
 * @type {object}
 * @default
 */
export const nodeType: {
  stylesheet: 'stylesheet',
  comment: 'comment',
  atRule: 'atRule',
  ruleset: 'ruleset',
  expression: 'expression',
  declaration: 'declaration',
  rulelist: 'rulelist',
  discarded: 'discarded'
};


/**
 * Class used for generating nodes in a CSS AST. Extend this class to implement
 * visitors to different nodes while the tree is being generated, and / or
 * custom node generation.
 */
export class NodeFactory {

  /**
   * Creates a Stylesheet node.
   * @param rules The list of rules that appear at the top
   * level of the stylesheet.
   */
  stylesheet(rules: Rule[]): Stylesheet;

  /**
   * Creates an At Rule node.
   * @param name The "name" of the At Rule (e.g., `charset`)
   * @param parameters The "parameters" of the At Rule (e.g., `utf8`)
   * @param rulelist The Rulelist node (if any) of the At Rule.
   */
  atRule(name: string, parameters: string, rulelist: Rulelist): AtRule;

  /**
   * Creates a Comment node.
   * @param value The full text content of the comment, including
   * opening and closing comment signature.
   */
  comment(value: string): Comment;

  /**
   * Creates a Rulelist node.
   * @param rules An array of the Rule nodes found within the Ruleset.
   */
  rulelist(rules: Rule[]): Rulelist;

  /**
   * Creates a Ruleset node.
   * @param selector The selector that corresponds to the Selector
   * (e.g., `#foo > .bar`).
   * @param rulelist The Rulelist node that corresponds to the Selector.
   */
  ruleset(selector: string, rulelist: Rulelist): Ruleset;

  /**
   * Creates a Declaration node.
   * @param name The property name of the Declaration (e.g., `color`).
   * @param value Either an Expression node, or a Rulelist node, that
   * corresponds to the value of the Declaration.
   */
  declaration(name: string, value: Expression | Rulelist): Declaration;

  /**
   * Creates an Expression node.
   * @param text The full text content of the expression (e.g.,
   * `url(img.jpg)`)
   */
  expression(text: string): Expression;

  /**
   * Creates a Discarded node. Discarded nodes contain content that was not
   * parseable (usually due to typos, or otherwise unrecognized syntax).
   * @param text The text content that is discarded.
   */
  discarded(text: string): Discarded;
}
