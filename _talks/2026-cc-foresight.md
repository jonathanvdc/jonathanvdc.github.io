---
title: "Parallel and Customizable Equality Saturation"
collection: talks
type: "Talk"
permalink: /talks/2026-cc-foresight
work_slug: foresight
date: 2026-01-31
venue: '35th ACM SIGPLAN International Conference on Compiler Construction'
venue_abbreviation: CC
location: "Sydney, Australia"
paperurl: /files/2026-cc-foresight.pdf
slidesurl: /files/2026-cc-foresight-slides.pdf
---

I presented [our paper on Foresight](/compiler-work/foresight/) at [CC 2026](https://conf.researchr.org/details/CC-2026/calls/15/Parallel-and-Customizable-Equality-Saturation), co-located with HPCA, CGO, and PPoPP.

The talk introduced Foresight, a parallel and customizable equality saturation engine implemented in Scala.
I focused on three design ideas: deferred parallel rewriting, programmable saturation strategies, and generalized e-graph metadata.
Together, these features make equality saturation easier to adapt to compiler optimization workflows that do not fit a single fixed saturation loop.

The preprint is available as [PDF](/files/2026-cc-foresight.pdf), and the source code is available on [GitHub](https://github.com/jonathanvdc/foresight).
