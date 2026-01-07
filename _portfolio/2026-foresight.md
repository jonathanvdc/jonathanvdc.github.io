---
title: "Foresight, Scala Equality Saturation Engine"
excerpt: "Foresight is a parallel, extensible equality saturation library in Scala, featuring programmable saturation strategies, generalized metadata, and deferred parallel rewriting."
collection: portfolio
---

I designed and implemented [Foresight](https://github.com/jonathanvdc/foresight), an equality saturation library motivated by concrete limitations I observed in existing engines, such as single-threaded execution, rigid saturation loops, and limited support for metadata.

## Design goals

Foresight's architecture is guided by three core ideas that address the limitaitons of prior approaches: parallel rewriting, saturation strategies and generalized metadata.

### Parallel rewriting as a first-class concern

Foresight performs parallel e-matching combined with deferred rewriting by producing rewrite commands from e-matches that are batched and applied in parallel.
This approach improves throughput while preserving correctness and fully exploits concurrency.

### Programmable saturation strategies

Instead of a fixed saturation loop, Foresight uses composable building blocks that let users programmatically control the rewriting process.
This flexibility enables experimentation and reuse, allowing saturation to be tailored to specific needs.

### Generalized metadata

Metadata is implemented as extensible observers attached to e-graphs, unifying various analyses and enabling advanced features such as incremental equality saturation.

## Results

Evaluation shows that Foresight consistently outperforms prior Scala-based equality saturation engines, achieving up to 16× speedups on a reimplementation of latent idiom recognition and robust scaling for key rewrite and analysis phases under parallel execution.
Its deferred rewriting architecture allows parallel rule matching and application to scale effectively, while generalized metadata enables features such as incremental equality saturation without modifying the core engine. Across multiple case studies, Foresight reduces the amount of custom, application-specific saturation code from hundreds of lines to a small number of composable strategy definitions.

The source code is available on GitHub at https://github.com/jonathanvdc/foresight.
The design and evaluation of Foresight are described in detail in our [CC’26 paper](/publication/2026-cc-foresight), which explores the system’s architecture and compares it to previous approaches.
