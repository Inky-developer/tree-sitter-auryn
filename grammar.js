/**
 * @file parser for the auryn programming language
 * @author Inky-developer <inky@mailbox.org>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  OR: 1,
  AND: 2,
  EQUALITY: 3,
  COMPARISON: 4,
  ADDITIVE: 5,
  MULTIPLICATIVE: 6,
  UNARY: 7,
  POSTFIX: 8,
};

export default grammar({
  name: "auryn",

  extras: ($) => [/\s/, $.comment],

  word: ($) => $.identifier,

  conflicts: ($) => [[$._expression, $.struct_literal]],

  rules: {
    source_file: ($) => repeat($._item),

    _item: ($) =>
      choice(
        $.function_definition,
        $.struct_definition,
        $.type_alias,
        $.extern_block,
      ),

    // --- Top-level declarations ---

    function_definition: ($) =>
      seq(
        "fn",
        field("name", $.identifier),
        $.parameter_list,
        optional($.return_type),
        $.block,
      ),

    struct_definition: ($) =>
      seq(
        "struct",
        field("name", $.identifier),
        "{",
        optional($.struct_body),
        "}",
      ),

    struct_body: ($) => comma_separated1($.struct_field),

    struct_field: ($) =>
      seq(field("name", $.identifier), ":", field("type", $._type)),

    type_alias: ($) =>
      seq("type", field("name", $.identifier), "=", field("type", $._type)),

    extern_block: ($) =>
      seq(
        "unsafe",
        "extern",
        field("language", $.string_literal),
        "{",
        repeat($.extern_item),
        "}",
      ),

    extern_item: ($) => seq(optional($.item_metadata), $.extern_type),

    extern_type: ($) =>
      seq(
        "type",
        field("name", $.identifier),
        "{",
        repeat($.extern_type_body_item),
        "}",
      ),

    extern_type_body_item: ($) =>
      seq(
        optional($.item_metadata),
        choice($.extern_static_let, $.extern_function),
      ),

    extern_static_let: ($) =>
      seq(
        "static",
        "let",
        field("name", $.identifier),
        ":",
        field("type", $._type),
      ),

    extern_function: ($) =>
      seq(
        optional("static"),
        "fn",
        field("name", $.identifier),
        $.parameter_list,
        optional($.return_type),
      ),

    item_metadata: ($) => seq("[", $.string_literal, "]"),

    // --- Parameters and return types ---

    parameter_list: ($) => seq("(", optional(comma_separated1($.parameter)), ")"),

    parameter: ($) =>
      seq(field("name", $.identifier), ":", field("type", $._type)),

    return_type: ($) => seq("->", field("type", $._type)),

    // --- Types ---

    _type: ($) =>
      choice($.named_type, $.array_type, $.structural_type, $.unit_type),

    named_type: ($) => $.identifier,

    array_type: ($) => seq("[", "]", $._type),

    structural_type: ($) =>
      seq("{", optional(comma_separated1($.structural_type_field)), "}"),

    structural_type_field: ($) =>
      seq(field("name", $.identifier), ":", field("type", $._type)),

    unit_type: (_$) => seq("(", ")"),

    // --- Blocks and statements ---

    block: ($) => seq("{", repeat($._statement), "}"),

    _statement: ($) =>
      choice(
        $.let_statement,
        $.if_statement,
        $.loop_statement,
        $.while_statement,
        $.break_statement,
        $.continue_statement,
        $.return_statement,
        $.update_statement,
        $._expression,
      ),

    let_statement: ($) =>
      seq(
        "let",
        field("name", $.identifier),
        optional(seq(":", field("type", $._type))),
        "=",
        field("value", $._expression),
      ),

    update_statement: ($) =>
      seq(
        field("target", $._expression),
        field("operator", $.update_operator),
        field("value", $._expression),
      ),

    update_operator: (_$) => choice("=", "+=", "-=", "*=", "/=", "%="),

    if_statement: ($) =>
      seq(
        "if",
        field("condition", $._expression),
        field("consequence", $.block),
        optional($.else_clause),
      ),

    else_clause: ($) =>
      seq("else", choice($.if_statement, $.block)),

    loop_statement: ($) => seq("loop", $.block),

    while_statement: ($) =>
      seq("while", field("condition", $._expression), $.block),

    break_statement: (_$) => "break",

    continue_statement: (_$) => "continue",

    return_statement: ($) => prec.right(seq("return", optional($._expression))),

    // --- Expressions ---

    _expression: ($) =>
      choice(
        $.binary_expression,
        $.unary_expression,
        $.call_expression,
        $.field_expression,
        $.struct_literal,
        $.parenthesized_expression,
        $.number_literal,
        $.string_literal,
        $.boolean_literal,
        $.identifier,
      ),

    binary_expression: ($) =>
      choice(
        prec.left(
          PREC.OR,
          seq(
            field("left", $._expression),
            field("operator", "or"),
            field("right", $._expression),
          ),
        ),
        prec.left(
          PREC.AND,
          seq(
            field("left", $._expression),
            field("operator", "and"),
            field("right", $._expression),
          ),
        ),
        prec.left(
          PREC.EQUALITY,
          seq(
            field("left", $._expression),
            field("operator", choice("==", "!=")),
            field("right", $._expression),
          ),
        ),
        prec.left(
          PREC.COMPARISON,
          seq(
            field("left", $._expression),
            field("operator", choice(">", ">=", "<", "<=")),
            field("right", $._expression),
          ),
        ),
        prec.left(
          PREC.ADDITIVE,
          seq(
            field("left", $._expression),
            field("operator", choice("+", "-")),
            field("right", $._expression),
          ),
        ),
        prec.left(
          PREC.MULTIPLICATIVE,
          seq(
            field("left", $._expression),
            field("operator", choice("*", "/", "%")),
            field("right", $._expression),
          ),
        ),
      ),

    unary_expression: ($) =>
      prec(PREC.UNARY, seq("not", field("operand", $._expression))),

    call_expression: ($) =>
      prec(
        PREC.POSTFIX,
        seq(
          field("function", $._expression),
          $.argument_list,
        ),
      ),

    argument_list: ($) =>
      seq("(", optional(comma_separated1($._expression)), ")"),

    field_expression: ($) =>
      prec.left(
        PREC.POSTFIX,
        seq(
          field("object", $._expression),
          ".",
          field("field", $.identifier),
        ),
      ),

    struct_literal: ($) =>
      seq(
        optional(field("name", $.identifier)),
        "{",
        optional(comma_separated1($.struct_literal_field)),
        "}",
      ),

    struct_literal_field: ($) =>
      seq(
        field("name", $.identifier),
        ":",
        field("value", $._expression),
      ),

    parenthesized_expression: ($) => seq("(", $._expression, ")"),

    // --- Literals ---

    number_literal: (_$) => /[0-9]+/,

    string_literal: (_$) => /"[^"]*"/,

    boolean_literal: (_$) => choice("true", "false"),

    // --- Other ---

    identifier: (_$) => /[a-zA-Z_][a-zA-Z0-9_]*/,

    comment: (_$) => token(seq("//", /.*/)),
  },
});

/**
 * Creates a comma-separated list with optional trailing comma.
 * @param {RuleOrLiteral} rule
 * @returns {SeqRule}
 */
function comma_separated1(rule) {
  return seq(rule, repeat(seq(",", rule)), optional(","));
}
