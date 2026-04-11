---
permalink: /
title: "About"
excerpt: "Compiler engineer specializing in optimizations, IR design, and equality saturation"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

I am a compiler engineer and PhD candidate at [McGill University's](https://www.mcgill.ca/) [School of Computer Science](https://www.cs.mcgill.ca/), affiliated with [Mila](https://mila.quebec).
I specialize in compiler optimizations, Intermediate Representation (IR) design, and equality saturation, with a focus on making advanced program transformations practical for real systems.

I build compiler infrastructure for ML accelerators, Field-Programmable Gate Arrays (FPGAs), managed runtimes, and MLIR tooling.
My recent work includes [Foresight](/portfolio/2026-foresight), a parallel equality saturation engine published at CC 2026, and [SkeleShare](/publication/2026-cgo-skeleshare), a CGO 2026 system for automated FPGA resource sharing.

I am currently exploring Canadian research and engineering roles in compilers, programming languages, and systems.

[Resume](/cv/) · [GitHub](https://github.com/jonathanvdc) · [Publications](/publications/) · [Email](mailto:jonathan.vandercruysse@mail.mcgill.ca)

Selected Compiler Work
======

* [Foresight](/portfolio/2026-foresight): a parallel, extensible equality saturation library in Scala with programmable saturation strategies, generalized metadata, and deferred parallel rewriting.
  Foresight achieves up to 16x speedups on a reimplementation of latent idiom recognition and is described in our [CC 2026 paper](/publication/2026-cc-foresight).
* [SkeleShare](/publication/2026-cgo-skeleshare): an equality-saturation-based system for automatic hardware resource sharing in FPGA designs.
  It combines algorithmic skeletons and solver-based extraction to match or exceed expert manual designs on neural-network and image-processing workloads.
* [Latent Idiom Recognition](/publication/2024-cgo-latent-idiom-recognition): a CGO 2024 approach for recognizing BLAS and PyTorch idioms using a minimalist functional array IR and equality saturation.
  The generated C implementations achieve a 1.46x geometric mean speedup over reference kernels.
* [Flame](/projects/2018-flame): an SSA-based compiler framework for managed languages.
  Flame reads and optimizes .NET programs and lowers managed-language code toward targets such as LLVM IR and WebAssembly.
* [Modelverse JIT](/portfolio/2017-modelverse-jit-compiler): a tiered just-in-time compiler for graph-based bytecode that reaches roughly 37x speedups over the previous virtual machine.

What I Am Looking For
======

I am especially interested in roles involving optimizing compilers, IR design, MLIR/LLVM infrastructure, equality saturation, language runtimes, hardware-aware compilation, and performance engineering.

Research Background
======

My PhD is supervised by [Christophe Dubach](https://cdubach.bitbucket.io).
I study how equality saturation can solve code generation and optimization challenges for ML accelerators and FPGAs.
Across this work, IR design is the common thread: I use functional program representations, rewrite systems, and extensible compiler infrastructure to expose optimization opportunities that are difficult to capture with brittle hand-written recognizers.

My work has resulted in peer-reviewed publications at top compiler venues, including CGO and CC, and in open-source compiler infrastructure.
