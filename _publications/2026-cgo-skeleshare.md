---
title: "SkeleShare: Algorithmic Skeletons and Equality Saturation for Hardware Resource Sharing"
authors: "Jonathan Van der Cruysse, Tzung-Han Juang, Shakiba Bolbolian Khah, Christophe Dubach"
collection: publications
permalink: /publication/2026-cgo-skeleshare
work_slug: skeleshare
excerpt: 'An automated approach to hardware resource allocation and sharing using equality saturation and algorithmic skeletons'
date: 2026-02-01
venue: 'Proceedings of the 24th ACM/IEEE International Symposium on Code Generation and Optimization (CGO)'
venue_abbreviation: CGO
paperurl: 'https://jonathanvdc.github.io/files/2026-cgo-skeleshare.pdf'
artifact_badges:
  - available
  - reusable
  - results-reproduced
bibtex: |
  @inproceedings{vandercruysse2026skeleshare,
    author = {Van der Cruysse, Jonathan and Juang, Tzung-Han and Khah, Shakiba Bolbolian and Dubach, Christophe},
    title = {SkeleShare: Algorithmic Skeletons and Equality Saturation for Hardware Resource Sharing},
    year = {2026},
    url = {https://jonathanvdc.github.io/files/2026-cgo-skeleshare.pdf},
    booktitle = {Proceedings of the 24th ACM/IEEE International Symposium on Code Generation and Optimization},
    numpages = {14},
    keywords = {FPGA compilation, functional programming, resource allocation, resource sharing, equality saturation, algorithmic skeletons, e-graphs},
    location = {Sydney, NSW, Australia},
    series = {CGO '26}
  }
#citation: 'Your Name, You. (2015). &quot;Paper Title Number 3.&quot; <i>Journal 1</i>. 1(3).'
---

At a glance
======

* Published at CGO 2026.
* Automates FPGA resource allocation and sharing using equality saturation and algorithmic skeletons.
* Uses solver-based extraction to choose designs that consolidate computations while respecting resource constraints.
* Matches or exceeds expert manual designs on neural-network and image-processing workloads targeting a real FPGA.
* [Preprint](/files/2026-cgo-skeleshare.pdf) · [Artifact](https://zenodo.org/records/17635867)

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
