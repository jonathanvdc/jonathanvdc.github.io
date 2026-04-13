---
title: "Garbage Collection for Julia on GPUs"
excerpt: "A prize-nominated master's thesis on compiler hooks and runtime support for fully transparent garbage collection in Julia GPU kernels."
collection: portfolio
work_slug: julia-gpu-gc
---

This was my master's thesis, and in hindsight it is one of the stranger and more interesting compiler systems projects I have worked on.
The goal was to make garbage-collected allocation work inside Julia kernels running on NVIDIA GPUs.
That sounds like a runtime problem, but most of the work was really compiler work: finding the right abstraction level in the Julia compiler, preserving enough GC information through LLVM IR, and then lowering it differently when the target was a GPU.

The context is CUDAnative, the predecessor of today's Julia GPU stack.
CUDAnative reused the ordinary Julia compiler for most of the pipeline, intercepted the LLVM IR before CPU-specific lowering, and sent that IR to LLVM's PTX backend.
That reuse was powerful, but it also exposed a hard boundary.
Julia programs assume a runtime with garbage collection; GPU kernels do not get to call Julia's CPU runtime.

Before this work, object allocation in GPU kernels was either rejected or implemented with a leaky CUDA `malloc`-style scheme.
Allocations happened, but memory was not reclaimed.
That is enough for a small demo and deeply unsatisfying if the goal is to make high-level Julia features compose naturally on GPUs.

## The compiler abstraction problem

The Julia compiler already knew how to keep GC roots alive on CPUs.
The trouble was that the useful information existed at the wrong abstraction levels.
Before GC frame lowering, Julia's LLVM IR still knew which pointers were GC-managed, using address spaces such as `addrspace(10)`.
That was robust enough for alternative collectors, but too high-level to lower directly for a GPU runtime without reimplementing a large and subtle compiler pass.

After GC frame lowering, the IR had concrete stack-allocated GC frames for Julia's CPU collector.
That was thin enough for code generation, but not robust enough for my GPU collector.
The CPU collector can inspect CPU stack frames; a CPU-side collector cannot inspect GPU stack memory while a kernel is running.

The solution was to split Julia's GC frame lowering into two phases.
The first phase was GC-agnostic and produced explicit intrinsics for root-set management, allocation, and write barriers.
The second phase was GC-specific and lowered those intrinsics either to Julia's ordinary CPU GC machinery or to CUDAnative's GPU GC machinery.

<pre class="story-code"><code>Julia IR
  |
LLVM IR with GC pointer address spaces
  |
GC-agnostic lowering
  |
explicit GC intrinsics
  |
CPU GC lowering  or  GPU GC lowering</code></pre>

The heart of the abstraction was small.
Instead of asking every alternative collector to understand all of Julia's GC frame lowering logic, the compiler emitted operations like:

<pre class="story-code"><code>julia.new_gc_frame(n)
julia.push_gc_frame(frame, n)
julia.get_gc_frame_slot(frame, i)
julia.pop_gc_frame(frame)
julia.gc_alloc_bytes(ptls, n)
julia.queue_gc_root(root)</code></pre>

This is the part I still think was quite elegant.
The abstraction was not a grand new IR.
It was a narrow seam in an existing production compiler: just robust enough to support another collector, and just thin enough that lowering it was formulaic.
I contributed the compiler-side pieces back to the mainline Julia compiler through [JuliaLang/julia#31135](https://github.com/JuliaLang/julia/pull/31135).

## Making a GC work across CPU and GPU

The collector itself was a conservative, non-moving mark-and-sweep GC for NVIDIA GPUs.
Allocations happened on the GPU.
Collections happened on the CPU.

That split sounds odd at first, but it made sense for the problem.
Mark-and-sweep collection performs pointer-chasing, synchronization-heavy work that CPUs are relatively good at.
The CPU can also allocate more memory for the GPU heap when a collection does not free enough space.
The GPU, meanwhile, is where allocation requests originate, so it needs a way to stop the world and ask the CPU to collect.

<pre class="story-code"><code>GPU thread runs out of memory
  -> request collection interrupt
  -> wait at safepoint

CPU interrupt handler
  -> wait until all warps are paused
  -> mark reachable objects from GPU root buffers
  -> sweep unreachable objects
  -> defragment free lists
  -> expand heap if needed

GPU threads resume</code></pre>

I implemented that communication path as a software interrupt system.
A GPU thread could request an interrupt or wait for an already-pending interrupt.
The CPU-side interrupt handler then ran the collection algorithm associated with the kernel launch.

Safepoints were the other crucial piece.
The collector can only run while object references are stable, so CUDAnative needed compiler-injected safepoint polling in GPU kernels.
When a collection was pending, active warps reported that they had reached a safepoint and waited.
Warps that had already finished execution entered a permanent safepoint state so the collector would not wait forever for threads that could no longer execute a polling function.

## Root sets without a CPU stack

The most GPU-specific part of the design was root-set management.
Julia's CPU GC stores roots in stack-allocated GC frames.
That does not work when the collector runs on the CPU and the mutator runs on the GPU: the CPU cannot simply inspect every GPU thread's stack.

The GPU lowering therefore mapped GC frames to per-thread root buffers in pinned host memory.
Pinned memory is accessible to both the CPU and the GPU, which made it a practical meeting point for the two devices.
The four root-frame intrinsics lowered to simple stack-like operations on those buffers:

<pre class="story-code"><code>new_gc_frame(n)
  -> return current root-buffer top

push_gc_frame(frame, n)
  -> advance root-buffer top by n slots

get_gc_frame_slot(frame, i)
  -> address frame[i]

pop_gc_frame(frame)
  -> restore root-buffer top to frame</code></pre>

This is a nice example of why compiler hooks matter.
If GC root management is already hard-coded as CPU stack manipulation, the GPU collector has nowhere to stand.
If it is preserved as a tiny set of explicit operations, the backend can reinterpret those operations for a very different runtime architecture.

## What the work enabled

The GC made a broader subset of Julia usable in GPU kernels.
In particular, it opened the door to idioms that require allocation: mutable and recursive data structures, arrays, and higher-level features that expect managed objects to exist rather than being forbidden by the GPU compiler.

The implementation was intentionally conservative.
It used free lists, pinned host memory, CPU-side marking, and conservative object scanning.
It was not the fastest imaginable GPU allocator.
But that was not the point.
The point was to show that transparent garbage collection for high-level GPU kernels was feasible within a real compiler stack.

The performance result was encouraging: allocation-heavy GPU benchmarks using the optimized GC achieved a mean speedup of about 2x over the CUDA `malloc` baseline used by the previous trivial allocation scheme.
That result says as much about CUDA `malloc` as it says about my collector, but it still mattered.
The GC was not merely more semantically complete; it was often faster than the status quo.

## What I learned

This thesis sits at a useful intersection of compiler engineering, runtime systems, and hardware constraints.
Most of the interesting work happened in the seams:

* between Julia's high-level semantics and LLVM IR,
* between GC metadata and backend lowering,
* between CPU and GPU memory systems,
* between compiler-injected safepoints and runtime stop-the-world behavior,
* between a production compiler's existing architecture and the hooks needed by a new target runtime.

It also gave me my first experience contributing nontrivial compiler infrastructure to a major open-source language implementation.
The work was nominated for a thesis prize, but the part that matters most to me now is that it forced me to think like a compiler engineer working inside someone else's real system.
You do not get to invent the perfect clean-slate design.
You find the seam that is small enough to land, expressive enough to be useful, and robust enough to survive contact with the rest of the compiler.

That lesson has aged well.
Much of my later work, from MLIR tooling to equality-saturation systems, is still about finding exactly those seams.

You can download the master's thesis [here](/files/2019-garbage-collection-abstractions-for-high-level-gpu-languages.pdf).
