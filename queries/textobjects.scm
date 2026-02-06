; Functions
(function_definition
  body: (block) @function.inside) @function.around

(extern_function) @function.around

; Classes (structs)
(struct_definition
  body: (struct_body) @class.inside) @class.around

(extern_type
  body: (extern_type_body_item) @class.inside) @class.around

; Parameters
(parameter) @parameter.inside

(argument_list
  (_) @parameter.inside)

(parameter_list
  "," @_delimiter
  .
  (parameter) @parameter.inside)
@parameter.around

(argument_list
  "," @_delimiter
  .
  (_) @parameter.inside)
@parameter.around

; Comments
(comment) @comment.inside
(comment) @comment.around

; Entries (struct fields, key-value pairs)
(struct_field) @entry.around

(struct_literal_field) @entry.around

(structural_type_field) @entry.around
