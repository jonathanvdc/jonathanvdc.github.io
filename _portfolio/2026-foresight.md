---
title: "Foresight, Scala Equality Saturation Engine"
excerpt: "Foresight is a parallel, extensible equality saturation library in Scala, featuring programmable saturation strategies, generalized metadata, and deferred parallel rewriting."
collection: portfolio
work_slug: foresight
---

I designed and implemented [Foresight](https://github.com/jonathanvdc/foresight), a Scala equality saturation library built around a simple bet: equality saturation should feel like compiler infrastructure, not just a fixed optimization algorithm.

Equality saturation is attractive because it separates two questions that traditional optimizers often tangle together.
First: what rewrites are legal?
Second: which final program should we choose?
An e-graph lets a compiler keep many equivalent programs alive at once, then defer the final choice to an extraction pass.
That is a lovely idea.
The trouble starts when you try to use it as part of a real compiler pipeline.

The standard saturation loop is almost suspiciously simple: run rules, rebuild, repeat until nothing changes or a budget runs out.
That simplicity is part of the appeal, but it becomes a problem when the workflow wants phases, stopping conditions, analysis feedback, search-space control, incremental updates, or domain-specific rule scheduling.
For compiler work, the interesting question is often not just "what are my rewrites?"
It is "how should the search itself behave?"

## The saturation loop is the abstraction boundary

The main design move in Foresight is to make saturation programmable.
Instead of baking one control loop into the engine, Foresight exposes saturation strategies: composable pieces of rewriting behavior that can be sequenced, repeated, bounded, instrumented, and combined with analyses.

That matters because compiler optimizations rarely want one undifferentiated bag of rewrites.
In an idiom recognizer, for example, broad algebraic rewrites can expose many equivalent array expressions, but library-specific rules may only make sense after the search has reached a useful normal form.
In an incremental optimizer, the right thing to do may be to reuse most of an existing e-graph and only re-saturate the parts affected by a program edit.
Those are not just different rule sets.
They are different saturation programs.

In Foresight, a strategy can express a pipeline along these lines:

<pre class="story-code"><code>val pipeline =
  algebraicRules.untilStable
    .then(libraryRules.withMatchLimit(10_000))
    .then(cleanupRules)
    .repeatUntilStable
    .withTimeout(30.seconds)</code></pre>

That sketch is intentionally small, but it captures the spirit of the API: the control structure of equality saturation becomes visible and reusable.
Strategies can also attach metadata, rebase an e-graph by extracting a compact representative and restarting from it, or swap between exhaustive, cached, backoff, and stochastic rule application policies.
The goal is not configurability for its own sake.
The goal is to let compiler engineers describe the search procedure they actually mean.

## Deferred rewriting makes parallelism tractable

Parallelizing equality saturation is awkward because matching and rewriting want to touch the same evolving graph.
If every match immediately mutates the e-graph, then rule application, analysis updates, congruence maintenance, and synchronization all become tangled together.
Foresight separates those phases.

The rewrite pipeline is staged:

<pre class="story-code"><code>parallel matching
    -&gt; rewrite commands
    -&gt; command simplification
    -&gt; batched e-graph update
    -&gt; metadata observers
    -&gt; next strategy step</code></pre>

Matches produce explicit rewrite commands.
Those commands can be collected, simplified, deduplicated, and applied later as a batch.
This deferred update boundary is the key systems trick: most of the expensive work can run in parallel, while mutation happens at a controlled synchronization point.

It also makes the architecture easier to reason about.
Rewrites stop being invisible side effects of pattern matching and become data that the engine can schedule, batch, inspect, and expose to metadata.
That is why deferred rewriting is not merely a performance optimization.
It is what lets parallelism fit cleanly into the rest of the design.

## E-graphs need more than equivalence

Real compiler optimizers carry facts.
They need types, costs, constants, provenance, binding information, versioning, and sometimes very domain-specific annotations.
Traditional e-class analyses cover part of that story, but Foresight generalizes metadata into extensible observers of e-graph updates.

The observer model gives metadata a principled place in the architecture.
When the e-graph changes, metadata layers can maintain their own view of those changes without being hard-coded into the core.
That is useful for ordinary analyses such as cost-guided extraction or constant propagation, but it also enables less standard features such as e-class versioning and incremental equality saturation.

Foresight also uses slotted e-graphs, which are designed to represent binding structure directly.
That matters for functional intermediate representations, where alpha-equivalence and bound variables are not edge cases.
If equality saturation is going to be useful beyond arithmetic expressions, the representation needs to respect the shape of real languages.

## A Scala library, not just a paper artifact

I wanted Foresight to be pleasant to use from Scala, not just interesting internally.
The library includes both immutable and mutable e-graph implementations.
The immutable version is useful when thread safety, speculation, or simple reasoning matter; the mutable version gives lower overhead for sequential workloads.
Both expose the same strategy and analysis machinery.

For front-end ergonomics, Foresight includes a Scala language DSL that can derive e-graph encoders, pattern matching helpers, and rewrite-rule builders from ordinary algebraic data types.
For lower-level use cases, it also exposes explicit rule, pattern, searcher, and applier APIs.
That split is important: the library should be approachable for small examples without hiding the machinery needed for serious compiler work.

## What changed

Foresight was evaluated across classical algebraic optimization, latent idiom recognition, scalability strategies from prior work, and incremental equality saturation.
The results show two different kinds of payoff.

The first payoff is performance.
Deferred rewriting and parallel execution let Foresight scale on workloads where sequential engines bottleneck, including a reimplementation of latent idiom recognition that runs up to 16x faster.

The second payoff is expressiveness.
Behaviors that would otherwise require modifying the engine can often be written as compact strategy definitions.
That includes multi-phase saturation, rebasing, cached rule application, backoff-style search control, and incremental workflows.

The project is ultimately about an abstraction boundary.
Foresight treats equality saturation not as a monolithic loop, but as a programmable search system with explicit phases, observable updates, and reusable control policies.
That makes the engine faster in the places where parallelism matters, but just as importantly, it makes equality saturation easier to adapt to the messy workflows that real compiler infrastructure tends to require.
