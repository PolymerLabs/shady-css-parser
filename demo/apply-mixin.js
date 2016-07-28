const { Parser, NodeFactory, Stringifier, nodeType } = shadyCss;

class MixinApplyRegistrar extends NodeFactory {
  constructor() {
    super();
    // A map of mixin names to a list of custom declaration nodes that represent
    // a "desugared" representation of those mixins. The desugared version is
    // an array of custom properties:
    this.mixinDeclarations = {};
    // "Default" declarations are the declarations that appear before apply
    // rules which may or may not set the same declaration names once they are
    // applied. This maps lists of default declarations to the ruleset that
    // contains them:
    this.rulesetDefaultDeclarations = new Map();
    // A map from rulesets to the apply rules they contain:
    this.rulesetApplyRules = new Map();
  }

  /**
   * Desugars a mixin into a list a declaration nodes. Also records the names
   * of the declarations in the mixin for later reference.
   */
  registerMixinDeclarations(mixin) {
    let mixinName = mixin.name;
    let rules = mixin.value.rules;
    let declarations = [];

    this.mixinDeclarations[mixinName] =
        this.mixinDeclarations[mixinName] || [];

    let declarationNames = this.mixinDeclarations[mixinName];

    for (let i = 0; i < rules.length; ++i) {
      let rule = rules[i];
      declarations.push(
          this.declaration(`${mixin.name}_-_${rule.name}`, rule.value));
      declarationNames.push(rule.name);
    }

    return declarations;
  }

  /**
   * Constructs a ruleset node. Opportunistically desugars any mixins into lists
   * of custom declarations. Also, maps "default" declarations and apply rules
   * to the ruleset for later reference.
   */
  ruleset(selector, rulelist) {
    let ruleset = super.ruleset(selector, rulelist);
    let defaultDeclarations = {};
    let applyRules = [];
    let rules = rulelist.rules;

    for (let i = 0; i < rules.length; ++i) {
      let rule = rules[i];

      if (rule.type === nodeType.declaration) {
        let isMixin = rule.value && rule.value.type === nodeType.rulelist;

        if (isMixin) {
          rules.splice.apply(
              rules, [i, 1].concat(this.registerMixinDeclarations(rule)));
        } else {
          // Save this as a "default" declaration for later use:
          // defaultDeclarations.push(rule);
          defaultDeclarations[rule.name] = rule;
        }
      } else if (rule.type === nodeType.atRule && rule.name === 'apply') {
        applyRules.push(rule);
      }
    }

    this.rulesetApplyRules.set(ruleset, applyRules);
    this.rulesetDefaultDeclarations.set(ruleset, defaultDeclarations);

    return ruleset;
  }
}

class MixinApplyStringifier extends Stringifier {
  constructor({
    mixinDeclarations = {},
    rulesetDefaultDeclarations = new Map(),
    rulesetApplyRules = new Map()
  }) {
    super();
    this.mixinDeclarations = mixinDeclarations;
    this.rulesetDefaultDeclarations = rulesetDefaultDeclarations;
    this.rulesetApplyRules = rulesetApplyRules;
    // Keeps a books of declarations that are visited early by being applied as
    // the "default" for a mixin declaration:
    this.visitedDeclarations = new Set();
  }

  /**
   * Given a ruleset and and applyRule, returns a stringified list of CSS
   * declarations that the mixin would de-sugar to.
   */
  computedMixinDeclarations(ruleset, applyRule) {
    let mixinName = applyRule.parameters.trim();
    let names = this.mixinDeclarations[mixinName];
    let defaultDeclarations =
        this.rulesetDefaultDeclarations.get(ruleset) || {};
    let declarations = [];

    names.forEach(name => {
      let defaultDeclaration = defaultDeclarations[name];
      let fallback = '';

      if (defaultDeclaration) {
        fallback = `,${this.visit(defaultDeclaration.value)}`;
        this.visitedDeclarations.add(defaultDeclaration);
      }

      declarations.push(`${name}: var(${mixinName}_-_${name}${fallback})`);
    });

    return declarations;
  }

  /**
   * Visit an AtRule and stringify it. If this AtRule is an @apply, look up its
   * Ruleset and call computeMixinDeclarations to determine its stringified
   * value.
   */
  [nodeType.atRule](atRule) {
    if (atRule.name !== 'apply') {
      return super[nodeType.atRule](atRule);
    }

    let ruleset = this.path[this.path.length - 3];

    return this.computedMixinDeclarations(ruleset, atRule).join(';') + ';';
  }

  /**
   * Stringify a Rulelist. This is done in two steps:
   *  1. Visit all apply rules and stringify them ahead of time. This allows
   *     any default declarations to be "pre-visited".
   *  2. Visit all unvisited rules and push their stringified representation
   *     onto a list in the order they appear in the Rulelist.
   */
  [nodeType.rulelist](rulelist) {
    let ruleset = this.path[this.path.length - 2];
    if (!ruleset || ruleset.type !== nodeType.ruleset) {
      return super[nodeType.rulelist](rulelist);
    }
    let applyRules = this.rulesetApplyRules.get(ruleset);
    let stringifiedApplyRules = new Map();
    let output = [];

    for (let i = 0; i < applyRules.length; ++i) {
      let applyRule = applyRules[i];
      stringifiedApplyRules.set(applyRule, this.visit(applyRules[i]));
    }

    for (let i = 0; i < rulelist.rules.length; ++i) {
      let rule = rulelist.rules[i];

      if (this.visitedDeclarations.has(rule)) {
        continue;
      } else if (stringifiedApplyRules.has(rule)) {
        output.push(stringifiedApplyRules.get(rule));
      } else {
        output.push(this.visit(rule));
      }
    }

    return `{ ${output.join('')} }`;
  }
}

shadyCss.transformCssText = function(inputCss) {
  let mixinApplyRegistrar = new MixinApplyRegistrar();
  let mixinApplyStringifier = new MixinApplyStringifier(mixinApplyRegistrar);

  let parser = new Parser(mixinApplyRegistrar);
  let ast = parser.parse(inputCss);

  return mixinApplyStringifier.stringify(ast);
}
