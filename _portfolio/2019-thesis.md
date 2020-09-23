---
title: "Master's Thesis: Garbage Collection Abstractions for High-Level GPU Languages"
excerpt: "I created the first GPU garbage collector for the Julia language!<br/><img style='width:500px;' src='/images/teaser-2019-julia.svg'>"
collection: portfolio
---

I designed and implemented a garbage collector (GC) for the [CUDAnative](https://github.com/JuliaGPU/CUDAnative.jl) Julia package.
CUDAnative compiles high-level [Julia](https://julialang.org) code to PTX instructions that NVIDIA GPUs can execute.
To do so, CUDAnative reuses the Julia compiler to generate LLVM IR that it modifies to be suitable for use on GPUs.

My contributions were as follows:
  1. I introduced a new abstraction layer in the Julia compiler. The abstraction is suitable for conservative mark-and-sweep GCs, including the CPU Julia GC. I contributed my changes back to the upstream Julia project by means of a [pull request](https://github.com/JuliaLang/julia/pull/31135).
  2. I implemented a conservative mark-and-sweep GC for GPUs. The GC allocates data on the GPU and performs collections on the CPU. To support this inter-device communication at run time, I introduced a software interrupt system.
  3. I modified the CUDAnative package to generate instructions that support the GC's operation. This includes rewriting allocations to call the GC and root set management (so the GC knows which objects are reachable).

On average, benchmarks that used my GC were twice as fast as when they were compiled to use CUDA's `malloc` implementation. While CUDA `malloc` is known to be a slow allocator, this data shows that GCs on GPUs are feasible.

You can download my master's thesis [here](/files/2019-garbage-collection-abstractions-for-high-level-gpu-languages.pdf).

<img src='/images/teaser-2019-julia.svg'>
