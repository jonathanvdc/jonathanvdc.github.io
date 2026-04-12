---
title: "Flame"
excerpt: "An SSA-based compiler framework for managed languages, with optimization passes and LLVM/WebAssembly-oriented back ends."
collection: projects
work_slug: flame
---

[Flame](https://github.com/jonathanvdc/flame) is an SSA-based compiler framework for managed languages.
It explores what LLVM-like reusable compiler infrastructure can look like for managed-language ecosystems.
Flame reads managed-language programs, performs whole-program optimization, and lowers code toward targets such as LLVM IR and WebAssembly.

The framework includes front-end infrastructure for managed bytecode, an SSA intermediate representation, optimization passes, and multiple back ends.
Flame supports a [wealth of optimizations](https://jonathanvdc.github.io/Flame/api/Flame.Compiler.Transforms.html), ranging from constant propagation to partial scalar replacement of aggregates and LINQ-oriented optimization.

Selected capabilities include:

* Reading and optimizing .NET Intermediate Language (IL).
* Representing managed-language programs in SSA form.
* Whole-program optimization infrastructure.
* LLVM IR and WebAssembly-oriented lowering.
* Optimization passes for constant propagation, scalar replacement, and higher-level managed-code patterns.
