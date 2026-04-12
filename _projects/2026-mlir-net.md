---
title: "MLIR.NET"
excerpt: "Strongly typed MLIR infrastructure for .NET, with generated dialect APIs from TableGen/ODS."
collection: projects
work_slug: mlir-net
---

[MLIR.NET](https://github.com/jonathanvdc/MLIR.NET) is a strongly typed C# representation of [MLIR](https://mlir.llvm.org/).
It models core MLIR concepts such as operands, attributes, regions, blocks, operations, and types in .NET.

I designed the project to make MLIR manipulation safer and more ergonomic from C# while preserving enough detail for syntax-preserving IR transformations.
The infrastructure reconstructs MLIR's Operation Definition Specification (ODS) and uses TableGen definitions to generate dialect-specific C# types, parsers, and printers.

Selected contributions include:

* A layered representation of MLIR that separates concrete syntax-preserving structures from higher-level typed abstractions.
* Strongly typed operation, operand, attribute, region, and type models for generated dialect APIs.
* TableGen/ODS-driven code generation for dialect-specific C# APIs.
* Parser and printer infrastructure for round-tripping MLIR syntax.

The source code is available on [GitHub](https://github.com/jonathanvdc/MLIR.NET).
