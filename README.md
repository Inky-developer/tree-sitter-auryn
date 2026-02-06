# Tree sitter grammar for Auryn

Incomplete grammar for the [auryn programming language](https://github.com/Inky-developer/Auryn)

## Editor Setup

### Helix

Add the following to your `languages.toml`:
```toml
[[grammar]]
name = "auryn"

[grammar.source]
git = "https://github.com/Inky-developer/tree-sitter-auryn"
rev = "master"

[[language]]
comment-tokens = ["//"]
file-types = ["au"]
name = "auryn"
scope = "source.auryn"
```

To actually perform syntax highlighting, helix also needs the queries files. Copy `queries/*` to `<helix-runtime>/queries/auryn/*`.
