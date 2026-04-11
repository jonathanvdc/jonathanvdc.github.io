---
layout: single
title: "Compiler Work"
permalink: /compiler-work/
author_profile: true
---

This page collects the compiler systems and research projects most relevant to compiler engineering, programming languages, and systems roles.
My work centers on optimization, IR design, equality saturation, hardware-aware compilation, and managed-language infrastructure.

Foresight
======

[Foresight](/portfolio/2026-foresight) is a parallel, extensible equality saturation library in Scala.
It supports programmable saturation strategies, generalized e-graph metadata, and deferred parallel rewriting.

**Why it matters:** Foresight makes equality saturation more practical for complex compiler workflows where fixed saturation loops, single-threaded execution, and rigid analysis interfaces become limiting.

**Results:** Up to 16x speedups on a reimplementation of latent idiom recognition, with robust scaling for key rewrite and analysis phases.
The system is described in our [CC 2026 paper](/publication/2026-cc-foresight), and the source code is available on [GitHub](https://github.com/jonathanvdc/foresight).

**Technologies:** Scala, equality saturation, e-graphs, parallel rewriting, compiler optimization, IR metadata.

SkeleShare
======

[SkeleShare](/publication/2026-cgo-skeleshare) automates hardware resource allocation and sharing for FPGA designs.
It combines equality saturation, algorithmic skeletons, and solver-based extraction to search across hardware design choices.

**Why it matters:** Efficient FPGA compilation requires expert decisions about resource sharing and duplication.
SkeleShare turns that manual hardware-design problem into an automated compiler optimization problem.

**Results:** Evaluated on neural-network and image-processing workloads targeting a real FPGA, SkeleShare matches or exceeds expert manual designs.
The work appears at CGO 2026, with an artifact available on Zenodo.

**Technologies:** Equality saturation, FPGA compilation, high-level synthesis, solver-based extraction, hardware-aware optimization.

Latent Idiom Recognition
======

[Latent Idiom Recognition](/publication/2024-cgo-latent-idiom-recognition) uses equality saturation and a minimalist functional array IR to recognize hidden BLAS and PyTorch idioms.

**Why it matters:** Traditional idiom recognizers are brittle: small syntactic changes can hide an optimization opportunity.
This work represents programs and idioms in the same compact functional language so equality saturation can discover library calls through semantics-preserving rewrites.

**Results:** The generated C implementations achieve a 1.46x geometric mean speedup over reference kernels.
The work was published at CGO 2024, and an artifact is available on Zenodo.

**Technologies:** Equality saturation, functional IRs, array programming, BLAS, PyTorch, optimization search.

Flame
======

[Flame](/projects/2018-flame) is an SSA-based compiler framework for managed languages.
It reads managed-language programs, performs whole-program optimization, and lowers code toward targets such as LLVM IR and WebAssembly.

**Why it matters:** Flame explores what LLVM-like reusable compiler infrastructure can look like for managed-language ecosystems.
It combines bytecode front ends, SSA IR infrastructure, optimization passes, and multiple back ends.

**Selected capabilities:** .NET IL support, managed-code optimization, SSA construction, constant propagation, scalar replacement of aggregates, LINQ-oriented optimizations, LLVM IR emission, and WebAssembly emission.

**Technologies:** C#, .NET, JVM bytecode, SSA IRs, LLVM IR, WebAssembly, whole-program optimization.

MLIR.NET
======

[MLIR.NET](/projects/2026-mlir-net) is a strongly typed .NET representation of MLIR.
It models MLIR concepts such as operands, attributes, regions, and types in C#, and reconstructs MLIR's Operation Definition Specification (ODS) to generate dialect-specific APIs from TableGen definitions.

**Why it matters:** MLIR is powerful but structurally rich.
MLIR.NET explores how to make that structure safer and more ergonomic from .NET while preserving enough detail for syntax-preserving IR manipulation.

**Selected capabilities:** Typed operation models, generated dialect-specific C# types, parser/printer infrastructure, layered concrete and abstract representations, and TableGen-driven code generation.

**Technologies:** C#, MLIR, TableGen, ODS, typed IRs, parser/printer generation, compiler tooling.

Julia GPU Garbage Collection
======

My master's thesis explored [garbage collection for Julia on GPUs](/portfolio/2019-thesis).
I designed and implemented a conservative mark-and-sweep GPU garbage collector for CUDAnative.jl and introduced abstraction layers in the Julia compiler to support GC implementation reuse.

**Results:** Benchmarks using the GC were roughly twice as fast as versions compiled to use CUDA's `malloc` implementation.

**Technologies:** Julia, GPU programming, CUDAnative.jl, LLVM IR, garbage collection, runtime systems.

Modelverse JIT
======

The [Modelverse JIT compiler](/portfolio/2017-modelverse-jit-compiler) is a tiered just-in-time compiler for graph-based bytecode.
It includes a fast interpreter, a baseline JIT, and an optimizing SSA-based JIT.

**Results:** Typical Modelverse workloads run roughly 37x faster than on the previous virtual machine.

**Technologies:** JIT compilation, SSA IRs, bytecode interpretation, tiered compilation, runtime optimization.
