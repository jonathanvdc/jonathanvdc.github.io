---
title: "Parallel and Customizable Equality Saturation"
authors: "Jonathan Van der Cruysse, Abd-El-Aziz Zayed, Mai Jacob Peng, Christophe Dubach"
collection: publications
permalink: /publication/2026-cc-foresight
work_slug: foresight
excerpt: "A parallel, extensible equality saturation engine with programmable strategies and generalized metadata"
date: 2026-02-01
venue: "Proceedings of the 35th ACM SIGPLAN International Conference on Compiler Construction (CC)"
venue_abbreviation: CC
paperurl: "https://jonathanvdc.github.io/files/2026-cc-foresight.pdf"
artifact_badges:
  - available
  - reusable
  - results-reproduced
bibtex: |
  @inproceedings{vandercruysse2026foresight,
    author = {Van der Cruysse, Jonathan and Zayed, Abd-El-Aziz and Peng, Mai Jacob and Dubach, Christophe},
    title = {Parallel and Customizable Equality Saturation},
    year = {2026},
    isbn = {9798400722745},
    publisher = {Association for Computing Machinery},
    address = {New York, NY, USA},
    url = {https://doi.org/10.1145/3771775.3786266},
    doi = {10.1145/3771775.3786266},
    abstract = {Equality saturation enables compilers to explore many semantically equivalent program variants, deferring optimization decisions to a final extraction phase. However, existing frameworks exhibit sequential execution and hard-coded saturation loops. This limits scalability and requires significant engineering effort to customize saturation behavior. This paper addresses these limitations using three novel techniques. First, it shows how saturation can be parallelized thanks to the use of thread-safe data structures and the notion of deferred e-graph updates. Second, it provides an extensible mechanism to express custom and composable saturation strategies. Third, it generalizes e-graph metadata to support custom e-graph annotations. The implementation, written in Scala, is evaluated on four use-cases: classical program optimization, idiom recognition, scalability strategies and incremental equality saturation. The results show that it outperforms several existing equality saturation engines, including the highly optimized egglog library. When used to reimplement an existing idiom recognition technique, the new design finds higher-quality idioms, 16\texttimes{} faster. Additionally, the design is able to natively express state-of-the-art custom equality saturation behavior such as incremental equality saturation and multi-phase rewriting strategies without any modification to the core library.},
    booktitle = {Proceedings of the 35th ACM SIGPLAN International Conference on Compiler Construction},
    pages = {94–105},
    numpages = {12},
    keywords = {Compiler Infrastructure, E-Graphs, Equality Saturation, Program Optimization, Rewrite Systems},
    location = {Sydney, NSW, Australia},
    series = {CC '26}
  }
---

At a glance
======

* Published at CC 2026.
* Introduces Foresight, a parallel and customizable equality saturation engine implemented in Scala.
* Adds programmable saturation strategies, generalized e-graph metadata, and deferred parallel rewriting.
* Achieves up to a 16x speedup when reimplementing an existing idiom-recognition system.
* [Preprint](/files/2026-cc-foresight.pdf) · [Source](https://github.com/jonathanvdc/foresight) · [Artifact](https://zenodo.org/records/17955956)

Equality saturation is a powerful compiler optimization technique that represents many semantically equivalent program variants in a single data structure, an e-graph, deferring optimization decisions to a final extraction phase. While equality saturation has enabled a wide range of optimizations and program analyses, existing frameworks suffer from two fundamental limitations: they are largely single-threaded, and they rely on rigid, hard-coded saturation loops that are difficult to customize.

This paper introduces Foresight, a new equality saturation library designed around parallelism and extensibility. Foresight enables parallel e-matching and rewriting through a thread-safe e-graph and a novel deferred update mechanism that batches and optimizes rewrite effects before applying them. This design exposes substantial fine-grained parallelism while preserving the semantics of classic equality saturation.

Beyond parallelism, Foresight replaces fixed saturation loops with programmable saturation strategies.
These strategies are composable building blocks that declaratively describe how rewriting proceeds, including rule scheduling, stopping conditions, rebasing, and multi-phase optimization pipelines. Complex saturation behaviors from prior work can be expressed in just a few lines of user code, without modifying the core library.

Finally, Foresight generalizes e-graph metadata by treating analyses and annotations as first-class, extensible observers of e-graph updates.
This unifies traditional e-class analyses with more advanced use cases such as e-class versioning, enabling features like incremental equality saturation without forking or redesigning the underlying e-graph.

Foresight is implemented in Scala and evaluated on four case studies: classical algebraic optimizations, latent idiom recognition, the reimplementation of existing scalability strategies from the literature, and incremental equality saturation.
The evaluation shows that Foresight outperforms several existing equality saturation engines, including egglog, on parallel workloads, and achieves up to a 16× speedup when reimplementing an existing idiom recognition system—while also producing higher-quality results.

Download the preprint [here](/files/2026-cc-foresight.pdf).
The [source code](https://github.com/jonathanvdc/foresight) is available on GitHub and an [artifact](https://zenodo.org/records/17955956) is available on Zenodo.
