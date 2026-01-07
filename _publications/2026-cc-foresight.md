---
title: "Parallel and Customizable Equality Saturation"
authors: "Jonathan Van der Cruysse, Abd-El-Aziz Zayed, Mai Jacob Peng, Christophe Dubach"
collection: publications
permalink: /publication/2026-cc-foresight
excerpt: "A parallel, extensible equality saturation engine with programmable strategies and generalized metadata"
date: 2026-02-01
venue: "Proceedings of the 35th ACM SIGPLAN International Conference on Compiler Construction (CC)"
paperurl: "https://jonathanvdc.github.io/files/2026-cc-foresight.pdf"
---

Equality saturation is a powerful compiler optimization technique that represents many semantically equivalent program variants in a single data structure, an e-graph, deferring optimization decisions to a final extraction phase. While equality saturation has enabled a wide range of optimizations and program analyses, existing frameworks suffer from two fundamental limitations: they are largely single-threaded, and they rely on rigid, hard-coded saturation loops that are difficult to customize.

This paper introduces Foresight, a new equality saturation library designed around parallelism and extensibility. Foresight enables parallel e-matching and rewriting through a thread-safe e-graph and a novel deferred update mechanism that batches and optimizes rewrite effects before applying them. This design exposes substantial fine-grained parallelism while preserving the semantics of classic equality saturation.

Beyond parallelism, Foresight replaces fixed saturation loops with programmable saturation strategies.
These strategies are composable building blocks that declaratively describe how rewriting proceeds, including rule scheduling, stopping conditions, rebasing, and multi-phase optimization pipelines. Complex saturation behaviors from prior work can be expressed in just a few lines of user code, without modifying the core library.

Finally, Foresight generalizes e-graph metadata by treating analyses and annotations as first-class, extensible observers of e-graph updates.
This unifies traditional e-class analyses with more advanced use cases such as e-class versioning, enabling features like incremental equality saturation without forking or redesigning the underlying e-graph.

Foresight is implemented in Scala and evaluated on four case studies: classical algebraic optimizations, latent idiom recognition, the reimplementation of existing scalability strategies from the literature, and incremental equality saturation.
The evaluation shows that Foresight outperforms several existing equality saturation engines, including egglog, on parallel workloads, and achieves up to a 16× speedup when reimplementing an existing idiom recognition system—while also producing higher-quality results.

Download the preprint [here](/files/2026-cc-foresight.pdf).
An [artifact](https://zenodo.org/records/17955956) is available on Zenodo.

<!-- BibTeX citation:
```
@inproceedings{vandercruysse2024liar,
    author = {Van der Cruysse, Jonathan and Dubach, Christophe},
    title = {Latent Idiom Recognition for a Minimalist Functional Array Language using Equality Saturation},
    year = {2024},
    url = {https://jonathanvdc.github.io/files/2024-cgo-latent-idiom-recognition.pdf},
    abstract = {Accelerating programs is typically done by recognizing code idioms matching high-performance libraries or hardware interfaces. However, recognizing such idioms automatically is challenging. The idiom recognition machinery is difficult to write and requires expert knowledge. In addition, slight variations in the input program might hide the idiom and defeat the recognizer.
    
    This paper advocates for the use of a minimalist functional array language supporting a small, but expressive, set of operators. The minimalist design leads to a tiny sets of rewrite rules, which encode the language semantics. Crucially, the same minimalist language is also used to encode idioms. This removes the need for hand-crafted analysis passes, or for having to learn a complex domain-specific language to define the idioms.
    
    Coupled with equality saturation, this approach is able to match the core functions from the BLAS and PyTorch libraries on a set of computational kernels. Compared to reference C kernel implementations, the approach produces a geometric mean speedup of 1.46x for C programs using BLAS, when generating such programs from the high-level minimalist language.},
    booktitle = {Proceedings of the 22nd ACM/IEEE International Symposium on Code Generation and Optimization},
    numpages = {9},
    keywords = {equality saturation, functional programming, array programming, pattern matching, libraries},
    location = {Edinburgh, United Kingdom},
    series = {CGO '24}
}
``` -->
