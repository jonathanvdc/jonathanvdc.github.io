---
title: "MLIR.NET"
excerpt: "Work-in-progress MLIR infrastructure for .NET: syntax-preserving parsing, semantic binding, TableGen/ODS import, and Roslyn-generated typed dialect APIs."
collection: projects
work_slug: mlir-net
---

[MLIR.NET](https://github.com/jonathanvdc/MLIR.NET) is still very much in progress.
That matters for how I think about it.
This is not a wrapped-up research artifact with a clean final result.
It is compiler infrastructure I am actively shaping: a .NET-native way to parse, preserve, bind, transform, and generate APIs for [MLIR](https://mlir.llvm.org/).

The motivation is simple: MLIR is powerful, but most of its ecosystem assumes C++.
If you want to build compiler tools in C#, you can either treat MLIR as strings and process boundaries, or you can build a real model of the IR.
MLIR.NET is the second path.
It is an attempt to make MLIR feel like ordinary .NET compiler infrastructure without pretending that MLIR is a simple AST.

The project has two halves that need to meet cleanly:

<pre class="story-code"><code>MLIR text
  -> concrete syntax tree
  -> semantic IR model
  -> syntax-preserving transforms and printing

TableGen / ODS dialect descriptions
  -> interpreted TableGen records
  -> ODS model
  -> Roslyn-generated C# dialect APIs</code></pre>

The first half is about working with MLIR documents.
The second half is about understanding dialect definitions well enough to generate useful typed APIs.
The long-term value comes from connecting them: parsed operations should bind to generated operation classes, generated assembly formats should participate in parsing and printing, and downstream .NET projects should get dialect support by adding `.td` files rather than hand-writing binding layers.

## Syntax and semantics stay separate

One design choice I care about is that MLIR.NET keeps concrete syntax and semantic IR deliberately separate.
The parser produces a concrete syntax tree with tokens and trivia.
That CST is the source of truth for exact printing.
The binder then maps syntax into semantic nodes: modules, operations, regions, blocks, operands, successors, attributes, types, values, and diagnostics.

That separation is important because MLIR tools often need two different behaviors.
Sometimes you want a syntax-preserving edit where untouched parts of the file keep their original formatting and generic/custom assembly spelling.
Sometimes you want a semantic rewrite that rebuilds operations into a canonical syntax.

MLIR.NET models both:

<pre class="story-code"><code>Document.Parse(text)
  -> ModuleSyntax
  -> Binder.BindModule(...)
  -> Semantics.Module
  -> ConcreteSyntaxBuilder.BuildModule(...)
  -> Printer.Print(...)</code></pre>

The runtime has options for whether to preserve existing syntax or rebuild it, and whether to prefer custom assembly or generic MLIR syntax.
That makes the concrete syntax tree more than a parse artifact.
It becomes a controlled boundary between "keep the user's text stable" and "materialize the semantic form I asked for."

This is the same lesson I keep running into in compiler tools: a good IR library should not force syntax preservation and semantic manipulation into the same object.
Those jobs are related, but they have different invariants.

## Dialects are runtime objects, not just strings

The semantic layer uses a dialect registry to decide what an operation means.
If the binder sees an operation name that a registered dialect knows about, it can construct a typed operation through that operation's definition.
If not, the operation still survives as generic or uninterpreted MLIR.

That fallback behavior is important.
MLIR is extensible by design, and a useful tool cannot fail just because it has not learned every dialect in a file.
MLIR.NET needs to preserve unknown operations while giving known operations a safer C# surface.

The registry path also gives custom assembly formats somewhere principled to live.
Parsing, binding, syntax rebuilding, and verification can consult dialect hooks instead of scattering dialect-specific cases through the printer.
The implementation is still evolving, but the architectural direction is clear: custom syntax behavior belongs to dialect definitions and syntax transforms, not to ad hoc output code.

## TableGen is a real language, so I treat it like one

The generator side starts with TableGen.
It would have been tempting to parse just enough strings to recognize a few ODS patterns, but that becomes brittle as soon as dialect definitions use inheritance, `let` bindings, lists, DAGs, includes, or MLIR's common prelude definitions.

So MLIR.NET has a dedicated `TableGen` project.
It lexes and parses TableGen into syntax, resolves includes, evaluates records, and produces an interpreted document.
Only then does `MLIR.ODS` import those records into a dialect model.

The pipeline is intentionally layered:

<pre class="story-code"><code>src/TableGen
  parse and evaluate TableGen

src/MLIR.ODS
  import evaluated records into dialect, op, attr, type, trait models

src/MLIR.Generators
  emit C# source through a Roslyn incremental generator

src/MLIR
  runtime CST, parser, binder, dialect registry, semantics, verifier, transforms</code></pre>

That layering gives each kind of problem a specific place to live.
If a feature belongs to the TableGen language, it is implemented in the TableGen layer.
If a feature belongs to ODS, it is represented in the ODS model.
If it is a C# API design question, it belongs in the generator or runtime surface.
That makes the implementation easier to extend because new MLIR features do not have to be smuggled through string matching or generator-only special cases.

This matters because upstream MLIR ODS is not a tiny configuration format.
It is a compiler-definition language with enough accumulated structure that shortcuts tend to turn into debt quickly.

The generator prelude is a good example of this approach.
`MLIR.Generators` carries pristine upstream MLIR TableGen files under `Prelude/Upstream/`.
Those files are not rewritten to make them more C#-shaped.
Instead, MLIR.NET composes them with files under `Prelude/Extensions/`, which use a custom TableGen `extends` overlay I added for this project.

Those overlays attach MLIR.NET-specific metadata to upstream records:

<pre class="story-code"><code>extends Builtin_DenseArray : MLIRNet_AttrOrTypeDefExtension {
  let csharpParameters = (ins
    Builtin_TypeParameter:$elementType,
    "long":$size,
    Builtin_DenseArrayRawDataParameter:$rawData
  );
}</code></pre>

The overlay records provide C# storage types, return types, parser and printer expressions, constant builders, and custom assembly-format hooks.
That metadata is the C# substitute for the C++-specific snippets and assumptions embedded in upstream ODS.
The upstream records remain the source of truth for MLIR structure, while MLIR.NET-specific overlays explain how those records should surface in generated C#.

## Typed APIs come from ODS

The current generator is a Roslyn incremental source generator.
Consumer projects add `.td` files as inputs, and the generator emits dialect registration classes plus typed operation, attribute, and type APIs.
Generated namespaces are derived from ODS metadata such as `cppNamespace`, so a dialect like `::mlir::arith` maps naturally into a C# namespace like `MLIR.Arith`.

A small dialect definition can produce ordinary C# usage:

<pre class="story-code"><code>using MLIR.Dialects;
using MLIR.Miniarith;

Dialect dialect = MiniarithDialectRegistration.Create();
Type addType = typeof(MiniArith_AddIOp);</code></pre>

The more interesting tests use real ODS-style fixtures for dialects such as `arith`, `func`, and builtin-like attributes and types.
The arith tests bind examples like:

<pre class="story-code"><code>%sum = arith.addi %lhs, %rhs : i32
%cmp = arith.cmpi slt, %lhs, %rhs : i32</code></pre>

through generated dialect classes, then print and rebind them through custom assembly.
That is the loop I care about:

<pre class="story-code"><code>ODS definition
  -> generated C# operation
  -> parse custom MLIR syntax
  -> bind typed operation
  -> print custom MLIR syntax again</code></pre>

If that loop works, the generated API is not decorative.
It is participating in the language.

## The active edge is attributes, types, and upstream fidelity

The current work is heavily focused on making the generated model line up with upstream MLIR's mental model.
Recent repository activity has been around typed attributes, dense-array payloads, constant attribute construction, `Attr` versus `AttrDef` semantics, and operation generation that consumes richer attribute metadata without assuming every ODS `Attr` is a concrete attribute definition.

That is a subtle distinction, but it is exactly the kind of distinction a binding generator has to get right.
In upstream MLIR, not every ODS attribute concept should become a standalone runtime class.
Some attribute records describe constraints or accessor behavior on operations.
Others define concrete attribute kinds.
If MLIR.NET flattens those together, the generated C# surface becomes noisy and misleading.

The open issues tell the same story.
There is active work to avoid duplicate symbol-name APIs, add semantic wrappers for sparse and dense-resource attributes, migrate builtin runtime APIs to generated TableGen definitions, and support custom type definitions with assembly formats.
Those are not polish tasks.
They are about choosing the right source of truth for MLIR semantics.

This is why I do not want to oversell the project as complete.
It currently supports a useful ODS-style subset: dialect records, operation definitions, operands/results, traits, assembly-format strings, dialect metadata, generated registration, generated operation classes, parsing, binding, and round-tripping.
It does not yet implement the full upstream MLIR ODS surface or complete declarative assembly-format semantics.
The point is that the architecture is now strong enough for those missing pieces to have a place to go.

## Why this project matters to me

MLIR.NET sits in a useful middle ground between hobby compiler infrastructure and production-shaped tooling.
It is not a compiler for one language.
It is infrastructure for building compiler tools around a multi-dialect IR.

The hard parts are the unglamorous ones:

* preserving tokens and trivia without making semantic code miserable,
* binding extensible operations while keeping unknown IR intact,
* evaluating enough TableGen to consume real ODS-style definitions,
* generating APIs that feel like C# rather than C++ wearing a different coat,
* deciding when generated code should preserve source spelling and when it should rebuild canonical syntax,
* making builtin types and attributes generated where possible instead of hand-maintained forever.

Those are the kinds of problems I enjoy because they reward patience.
Every layer teaches the next one what shape it needs.
The parser teaches the syntax model.
The binder teaches the semantic model.
ODS teaches the generator.
The generated dialects teach the runtime what its extension points should have been.

That feedback loop is the project.
MLIR.NET is still becoming itself, but the direction is clear: make MLIR a first-class .NET compiler infrastructure substrate, with typed generated APIs where the dialect is known and faithful syntax-preserving behavior where the tool must respect the text it was given.

The source code is available on [GitHub](https://github.com/jonathanvdc/MLIR.NET).
