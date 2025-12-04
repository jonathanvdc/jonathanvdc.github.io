---
title: "SkeleShare: Algorithmic Skeletons and Equality Saturation for Hardware Resource Sharing"
authors: "Jonathan Van der Cruysse, Tzung-Han Juang, Shakiba Bolbolian Khah, Christophe Dubach"
collection: publications
permalink: /publication/2026-cgo-skeleshare
excerpt: 'An idiom recognition approach rooted in equality saturation'
date: 2026-02-01
venue: 'Proceedings of the 24nd ACM/IEEE International Symposium on Code Generation and Optimization'
paperurl: 'https://jonathanvdc.github.io/files/2026-cgo-skeleshare.pdf'
#citation: 'Your Name, You. (2015). &quot;Paper Title Number 3.&quot; <i>Journal 1</i>. 1(3).'
---

Compiling functional programs into efficient Field Programmable Gate Array (FPGA) designs is difficult.
Hardware resources must be explicitly allocated and shared to maximize resource efficiency.
This requires careful orchestration of several transformations to expose and exploit sharing opportunities.
 
This paper introduces SkeleShare, a novel approach that automates the problem of resource allocation and sharing.
It leverages equality saturation and algorithmic skeletons to expose sharing opportunities across abstraction levels.
A solver-based extractor then selects a design that consolidates computations, meeting resource constraints while maintaining performance.

This approach is evaluated on neural networks and image processing targeting a real FPGA.
The paper shows how SkeleShare is used to express the various algorithmic patterns and transformation rules inherent in neural network operators.
The experimental evaluation demonstrates that SkeleShare's fully automated resource allocation and sharing matches and exceeds the performance of prior work, which involves expert manual extraction of sharing opportunities.

Download preprint [here](/files/2026-cgo-skeleshare.pdf). An [artifact](https://zenodo.org/records/17635867) is available on Zenodo.

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
