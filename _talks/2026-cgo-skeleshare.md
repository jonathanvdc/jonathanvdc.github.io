---
title: "SkeleShare: Algorithmic Skeletons and Equality Saturation for Hardware Resource Sharing"
collection: talks
type: "Talk"
permalink: /talks/2026-cgo-skeleshare
work_slug: skeleshare
date: 2026-02-02
venue: '24th ACM/IEEE International Symposium on Code Generation and Optimization'
venue_abbreviation: CGO
location: "Sydney, Australia"
paperurl: /files/2026-cgo-skeleshare.pdf
slidesurl: /files/2026-cgo-skeleshare-slides.pdf
---

I presented [our paper on SkeleShare](/compiler-work/skeleshare/) at [CGO 2026](https://2026.cgo.org/details/cgo-2026-papers/49/SkeleShare-Algorithmic-Skeletons-and-Equality-Saturation-for-Hardware-Resource-Shari), co-located with HPCA, PPoPP, and CC.

The talk described how equality saturation and algorithmic skeletons can automate hardware resource sharing for FPGA designs.
Instead of relying on expert manual transformations, SkeleShare exposes sharing opportunities across abstraction levels and uses solver-based extraction to select designs that consolidate computations while respecting resource constraints.

The preprint is available as [PDF](/files/2026-cgo-skeleshare.pdf), and the artifact is available on [Zenodo](https://zenodo.org/records/17635867).
