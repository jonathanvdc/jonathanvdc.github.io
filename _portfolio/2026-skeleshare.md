---
title: "SkeleShare, FPGA Resource Sharing with Equality Saturation"
excerpt: "SkeleShare uses algorithmic skeletons, equality saturation, and solver-based extraction to automate hardware resource allocation and sharing for FPGA programs."
collection: portfolio
work_slug: skeleshare
---

I worked on SkeleShare, a compiler technique for a problem that looks deceptively mundane from the software side: deciding when two computations should use the same hardware.

On an FPGA, this is not a backend detail.
If a compiler maps every operation to its own hardware unit, it can quickly run out of DSPs, routing capacity, or on-chip resources.
If it shares too aggressively, it may save resources but serialize work that should have run in parallel.
The interesting compiler problem is that allocation and sharing decisions are entangled with program transformations.
A design may only become shareable after padding, tiling, lowering, or rewriting across several abstraction levels.

That is the central idea behind SkeleShare: expose those choices in an e-graph, then let a solver jointly choose a resource-conforming implementation and a sharing plan.

## Sharing hides across abstraction levels

The motivating example in the paper is a small slice of a neural network: a convolution followed by a fully connected layer.
A straightforward compiler might build one hardware unit for the convolution and another for the matrix-vector product.
But a convolution can itself be expressed as many matrix-vector products over sliding windows.
Once that structure is exposed, the convolution's inner matrix-vector product may have the same shape as the fully connected layer's matrix-vector product, or it may be made compatible by padding dimensions.

At that point, the compiler has discovered something valuable: two operations that looked different at the surface can be implemented by the same kind of hardware.
The catch is that the path to that discovery is not one rewrite.
It may require lowering a high-level operator, padding one side, tiling another, and keeping enough structure intact that the FPGA backend can still recognize useful patterns.

That is why doing the transformations in one fixed order is brittle.
Lower too early, and the compiler loses the high-level structure needed by later optimizations.
Stay too abstract, and the sharing opportunity never appears.
SkeleShare uses equality saturation to avoid committing too early.

## Skeletons make implementation choices explicit

SkeleShare represents programs with algorithmic skeletons.
Traditional skeletons often describe what kind of parallel computation is being performed, such as maps and folds.
SkeleShare's skeletons are more implementation-oriented: they describe how a computation can be built out of lower-level hardware patterns.

For example, a convolution can be represented as a hierarchy:

<pre class="story-code"><code>Conv(input, weights,
  Mv(_, _,
    ParallelDot[parallelism]))</code></pre>

That hierarchy matters.
It says that a convolution can be implemented using matrix-vector products, and that those matrix-vector products can be implemented using parallel dot products.
Each level can be transformed without flattening the whole program.
Padding, tiling, transposition, partial dot products, and parallel convolution variants can all be expressed as skeleton-level alternatives.

This is the part I find most interesting: the IR is neither purely high-level nor purely low-level.
It keeps high-level operators visible while also exposing the implementation hooks that make hardware sharing possible.
The skeletons become a bridge between algorithmic structure and resource-level hardware choices.

## Equality saturation keeps the alternatives alive

Once the program is translated into skeleton IR, SkeleShare places it in an e-graph and applies domain-specific rewrite rules.
Those rules do not choose a final design immediately.
They add alternatives:

<pre class="story-code"><code>original Mv
  == padded Mv
  == tiled Mv
  == Mv built from partial dot products</code></pre>

For convolutions, the rules can express spatial tiling, channel tiling, padding, and rewrites through partial dot products.
For image-processing pipelines, similar skeletons express 1D and 2D convolution variants, including transposition-based rewrites.

The key is that the e-graph compactly stores many possible implementations at once.
Some variants use more parallelism and more DSPs.
Some use fewer resources but increase algorithmic time.
Some expose a hardware unit that can be shared by multiple consumers.
Equality saturation lets those possibilities coexist long enough for extraction to reason about them jointly.

## Extraction solves allocation and sharing together

The extractor is where SkeleShare differs from a typical "pick the cheapest expression" e-graph workflow.
It must choose both a program variant and a sharing plan.
In the paper, extraction is encoded as a solver problem with Boolean decisions such as:

<pre class="story-code"><code>select node n?
select e-class c?
share e-class c?</code></pre>

If an e-class is shared, the extractor outlines it as a let-bound hardware component: a function-like block that multiple uses call instead of duplicating the hardware.
If it is not shared, uses are duplicated.
The cost model distinguishes between the cost of using a component in place and the fixed cost of materializing a shared component.
That lets SkeleShare express the trade-off that every hardware designer knows: sharing saves DSPs at the call sites, but the shared unit and its communication overhead are not free.

The optimization is multidimensional.
DSP usage is treated as a hard resource constraint, while algorithmic time is minimized.
Because optimal extraction is hard, the implementation uses a solver-backed search with timeouts and refinement.
That is a pragmatic choice: the compiler needs a good hardware design under real resource constraints, not an elegant formulation that never terminates.

## Lowering happens after the sharing decision

After extraction, SkeleShare lowers the chosen skeleton program to backend-recognizable primitives for the FPGA toolchain.
The important detail is that lowering is delayed until after the e-graph and solver have done their work.

That delay is what lets SkeleShare reason across abstraction levels.
If every convolution, matrix-vector product, and dot product were expanded independently at the beginning, the compiler would have to rediscover structure from a flattened program.
By keeping skeletons around, SkeleShare can first choose the sharing structure and only then emit the lower-level hardware representation.

The pipeline looks roughly like this:

<pre class="story-code"><code>functional program
  -> skeleton IR
  -> equality saturation
  -> solver extraction
  -> shared skeleton program
  -> FPGA backend lowering</code></pre>

## What changed

SkeleShare was evaluated on neural-network and image-processing workloads targeting an Intel Arria 10 FPGA, including VGG-CIFAR, TinyYolo, a self-attention layer, and a stencil-style image-processing pipeline.

The important result is not just that the generated designs are fast.
It is that the compiler can automatically find sharing and allocation decisions that previously required expert manual rewriting.
On VGG, SkeleShare reaches 163 GOPS while fitting within the target FPGA resources.
On TinyYolo, it reaches 647 GOPS in the reported setup.
The ablation results are also telling: disabling sharing, padding, or tiling can prevent valid designs from being found at all.

That is the real lesson of the project.
Hardware resource sharing is not a local peephole optimization.
It is a global design problem that depends on transformations across abstraction levels.
SkeleShare shows how algorithmic skeletons can expose those levels, equality saturation can keep the alternatives alive, and solver-based extraction can choose a design that balances resource use and performance.

The system itself was research code, but the compiler idea is clean: make hardware sharing visible as a first-class extraction decision instead of hoping it falls out of a fixed lowering pipeline.
