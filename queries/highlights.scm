; Keywords
[
  "fn"
  "let"
  "if"
  "else"
  "loop"
  "while"
  "return"
  "struct"
  "type"
  "unsafe"
  "extern"
  "static"
  "not"
  "and"
  "or"
] @keyword

(break_statement) @keyword
(continue_statement) @keyword

; Operators
(binary_expression operator: _ @operator)
(update_operator) @operator

"." @operator
"->" @operator

; Functions
(function_definition name: (identifier) @function)
(extern_function name: (identifier) @function)
(call_expression function: (identifier) @function.call)

; Types
(named_type (identifier) @type)
(struct_definition name: (identifier) @type)
(type_alias name: (identifier) @type)
(extern_type name: (identifier) @type)
(struct_literal name: (identifier) @type)
(generic_parameter_definition name: (identifier) @type)

; Parameters
(parameter name: (identifier) @variable.parameter)

; Fields / properties
(struct_field name: (identifier) @variable.member)
(structural_type_field name: (identifier) @variable.member)
(struct_literal_field name: (identifier) @variable.member)
(field_expression field: (identifier) @variable.member)
(extern_static_let name: (identifier) @variable.member)

; Literals
(number_literal) @number
(string_literal) @string
(boolean_literal) @constant.builtin

; Comments
(comment) @comment

; Punctuation
[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

[
  ","
  ":"
] @punctuation.delimiter

; Item metadata
(item_metadata) @attribute
