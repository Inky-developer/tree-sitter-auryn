; Blocks and braced constructs
[
  (block)
  (struct_definition)
  (struct_literal)
  (structural_type)
  (extern_block)
  (extern_type)
] @indent

[
  "}"
] @outdent

; Parenthesized constructs
[
  (parameter_list)
  (argument_list)
  (parenthesized_expression)
] @indent

[
  ")"
] @outdent

; Bracketed constructs
[
  (generic_parameter_list)
  (type_argument_list)
  (item_metadata)
] @indent

[
  "]"
] @outdent
