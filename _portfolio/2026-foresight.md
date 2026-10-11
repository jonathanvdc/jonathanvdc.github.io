---
title: "Foresight, Scala Equality Saturation Engine"
excerpt: "A Scala equality saturation library with parallel rewriting and composable strategies for scheduling rules, bounding search, and restarting from extracted results."
collection: portfolio
work_slug: foresight
---

I designed and implemented [Foresight](https://github.com/jonathanvdc/foresight), a Scala library for equality saturation. Equality saturation lets a compiler explore equivalent versions of a program in an e-graph and then extract a result using a cost model. Keeping alternatives together postpones optimization decisions, but exploring those alternatives can be expensive: the graph may grow too large before the search finishes.

The usual saturation loop finds matches for rewrite rules, applies them, and repeats until the graph stops changing. Applications often need more control over that process. They may run different rules in successive phases, periodically discard alternatives, or reuse work across several inputs. Supporting those choices affects both how the search is organized and how the engine executes it.

Foresight addresses this through three parts of its design. Strategies compose the steps of a search, including repetition, time budgets, and restarting from an extracted result. Within each rewrite step, deferred commands let the engine compute and simplify updates in parallel before applying them to the graph. Metadata callbacks maintain the information that analyses and techniques such as incremental saturation need as that graph changes. We evaluated these pieces together by rebuilding LIAR, our array idiom recognizer, and by expressing saturation schedules from prior work as library strategies.

## Composing a saturation strategy

A strategy describes how an application explores the graph. A timeout can bound a simple saturation loop, but it does not express when to switch rule sets or discard intermediate search states. Foresight provides separate operations for those decisions and lets an application compose them into a schedule.

Isaria, an existing equality-saturation vectorizer, gives a useful example of such a schedule. It separates expansion rules from simplification rules. It alternates between those phases and periodically *rebases*: extracts a representative expression and builds a fresh e-graph from it. This discards accumulated alternatives before the next round of search. Vectorization rules run after that process.

In Foresight, we expressed this schedule using the following strategy from the paper:

<pre class="story-code"><code>def phase(rules: Seq[Rule]) =
  MaximalRuleApplication(rules)
    .withTimeout(phaseTimeout)
    .repeatUntilStable

phase(expansionRules)
  .thenApply(phase(simplificationRules))
  .withTimeout(expansionAndSimplTimeout)
  .thenRebase(extractor, areEquivalent)
  .repeatUntilStable
  .thenApply(phase(idiomRules))</code></pre>

Each phase has its own time budget, and the combined expansion and simplification step has another. Repetition, rebasing, and sequencing are library combinators, so the same pieces can be reused in other schedules. We also expressed a bounded, backoff-based strategy from symbolic-regression work in six lines and applied both schedules to our idiom recognizer. Their effects depended on the kernel: controlling graph growth could improve the result, but could also discard useful alternatives or spend too long exploring them.

## Rewrites produce commands

Each rule-application step in a strategy still needs to find matches and apply their rewrites. Many of those matches can be processed independently, so this is where Foresight introduces parallel execution. Doing so requires making graph searches safe for concurrent access and separating the computation of a rewrite from its application.

Parallel matching has a subtle obstacle: even a lookup can modify an e-graph. Union-find path compression updates parent pointers while finding an e-class's representative. Foresight uses atomic parent updates so multiple threads can safely search the graph.

Applying matches presents a separate problem. A rewrite normally inserts nodes and merges e-classes immediately. Foresight instead generates deferred commands in SSA form, using two operations: <code>add</code> and <code>union</code>. Matches can generate these commands independently, in parallel.

For example, rewriting <code>pow(v, 3)</code> as <code>v * pow(v, 2)</code> generates commands along these lines, where <code>d</code> is the e-class for <code>v</code> and <code>c</code> contains the original power:

<pre class="story-code"><code>%0 = add(2)
%1 = add(pow d, %0)
%2 = add(mul d, %1)
union %2, c</code></pre>

If the literal <code>2</code> already exists in e-class <code>b</code>, command simplification removes the first insertion and substitutes <code>b</code> for <code>%0</code>. Independent additions from different matches can then be grouped into batches; dependent additions wait for earlier batches. This also lets metadata updates run over batches of new nodes. Near saturation, many proposed additions already exist, so simplifying commands reduces the work that reaches the graph.

## Metadata for incremental saturation

Applying a batch changes more than the expressions stored in the graph. An optimizer also needs to update information associated with those expressions, such as their types and extraction costs. Foresight exposes callbacks after node additions and e-class unions so metadata can respond to the same batched updates used by the rewrite engine.

Ordinary e-class analyses derive facts such as types or costs from expressions. These fit the callback interface, but we also wanted it to accommodate information that analyses cannot derive. Incremental saturation provides an example: it needs a version number recording which input was being processed when an e-class was created. That history is not a fact derived from an expression's structure.

We used the metadata callbacks to maintain these versions, allowing successive inputs to share one evolving e-graph while restricting rewriting to classes relevant to the current input. This reproduced an incremental saturation technique that previously required a specialized fork of egg. Standard e-class analyses use the same metadata interface.

## Reimplementing LIAR

The strategy examples and incremental saturation experiment test individual parts of the design. To evaluate the rewrite engine and analysis machinery in a larger compiler application, we rebuilt [LIAR, our latent idiom recognizer](/compiler-work/latent-idiom-recognition/). LIAR uses equality saturation to find opportunities to replace array computations with BLAS calls, requiring variable binding, type inference, and extraction alongside rewriting.

Foresight's slotted e-graphs handle variable binding directly, eliminating LIAR's De Bruijn index and shift-rule machinery. Type inference became an e-class analysis, and an extraction analysis supported beta reduction.

Across the BLAS benchmarks, the reimplementation achieved almost **16× geometric mean saturation speedup** over the original LIAR engine. It also found better replacements for some kernels. For <code>gemm</code>, the original recognizer produced a combination of <code>axpy</code>, <code>gemv</code>, and <code>memset</code> calls; the reimplementation found a <code>gemm</code> call plus a transpose. The resulting code ran **10× faster** on that benchmark.

The 16× comparison includes changes to the representation and rewrite engine as well as parallel execution. In a separate thread-scaling experiment, saturation of <code>stencil2d</code> reached about **1.7× speedup at eight threads**. Matching and command generation scaled well, but sequential hashconsing and parts of metadata maintenance limited overall throughput.

The classical optimization benchmarks give a complementary comparison with other engines. Foresight found Horner's method and optimal associations for matrix-multiplication chains. It outperformed hegg and slotted on those benchmarks, and egglog on the matrix-chain workloads, but **egg remained faster across all of them**. Foresight's JVM implementation used more memory; the paper reports Java heap usage and egg's resident set size separately.

For applications using the library, Foresight supports Scala 2 and 3 and includes a language DSL for deriving encoders and rewrite helpers from algebraic data types. The [CC 2026 paper](/files/2026-cc-foresight.pdf) describes the algorithms and evaluation in detail. The [source](https://github.com/jonathanvdc/foresight) and [evaluation artifact](https://zenodo.org/records/17955956) are also available.
