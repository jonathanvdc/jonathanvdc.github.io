---
title: "Flame"
excerpt: "An optimizing compiler for managed code."
collection: projects
---

[Flame](https://github.com/jonathanvdc/flame) is a hobby project that aims to fill a niche similar to LLVM's but for managed code. Flame can read and write .NET executables and libraries. It can also optimize them by translating the .NET Intermediate Language (IL) to an SSA form IR.

Flame supports a [wealth of optimizations](https://jonathanvdc.github.io/Flame/api/Flame.Compiler.Transforms.html), ranging from constant propagation to (partial) scalar replacement of aggregates and LINQ optimization.
