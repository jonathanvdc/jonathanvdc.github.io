export const compilerProjects = [
  {
    id: 'foresight',
    title: 'Foresight',
    subtitle: 'Parallel equality saturation',
    href: '/compiler-work/foresight/',
    venue: 'CC 2026',
    impact: '≈16× mean LIAR saturation speedup',
    role: 'Designed and implemented the core system',
    blurb:
      'An equality saturation library that rewrites e-graphs in parallel. Written in Scala, with support for custom saturation strategies.',
    tech: ['Scala', 'e-graphs', 'parallel rewriting', 'IR metadata'],
    links: [
      { label: 'Paper', href: '/files/2026-cc-foresight.pdf' },
      { label: 'Slides', href: '/files/2026-cc-foresight-slides.pdf' },
      { label: 'Source', href: 'https://github.com/jonathanvdc/foresight' }
    ],
    visual: 'egraph',
    mask: {
      src: '/images/teaser-2026-foresight-mask.svg',
      alt: 'Foresight parallel equality saturation teaser silhouette',
      from: '#0996e9ff',
      to: '#031868ff'
    },
    featured: true
  },
  {
    id: 'skeleshare',
    title: 'SkeleShare',
    subtitle: 'FPGA resource sharing',
    href: '/compiler-work/skeleshare/',
    venue: 'CGO 2026',
    impact: 'Matches or exceeds expert designs',
    role: 'Equality-saturation system for hardware design search',
    blurb:
      'Uses equality saturation to explore how FPGA designs can share hardware resources. A solver selects a design from the resulting e-graph.',
    tech: ['FPGA', 'HLS', 'equality saturation', 'solver extraction'],
    links: [
      { label: 'Paper', href: '/files/2026-cgo-skeleshare.pdf' },
      { label: 'Slides', href: '/files/2026-cgo-skeleshare-slides.pdf' }
    ],
    visual: 'fpga',
    mask: {
      src: '/images/teaser-2026-skeleshare.svg',
      alt: 'SkeleShare FPGA resource sharing teaser silhouette',
      from: '#e9b109ff',
      to: '#682d09ff'
    },
    featured: true
  },
  {
    id: 'latent-idiom-recognition',
    title: 'Latent Idiom Recognition',
    subtitle: 'Semantic library-call discovery',
    href: '/compiler-work/latent-idiom-recognition/',
    venue: 'CGO 2024',
    impact: '1.46x geometric mean speedup',
    role: 'Functional array IR and equality-saturation recognizer',
    blurb:
      'Finds opportunities to replace array code with BLAS or PyTorch calls, using equality saturation to recognize equivalent computations.',
    tech: ['array IRs', 'BLAS', 'PyTorch', 'optimization search'],
    links: [
      { label: 'Paper', href: '/files/2024-cgo-latent-idiom-recognition.pdf' },
      { label: 'Slides', href: '/files/2024-cgo-slides.pdf' }
    ],
    mask: {
      src: '/images/teaser-2024-liar-mask.svg',
      alt: 'Latent Idiom Recognition teaser silhouette',
      from: '#febd3aff',
      to: '#d8582fff'
    }
  },
  {
    id: 'flame',
    title: 'Flame',
    subtitle: 'Managed-language compiler framework',
    href: '/compiler-work/flame/',
    venue: 'Open source',
    impact: 'Evolved from expression trees into an SSA CFG optimizer',
    role: 'Designed the IR, analyses, optimization passes, back ends',
    blurb:
      'A hobby compiler framework written in C#. It includes an SSA-based optimizer and back ends for .NET IL and LLVM IR.',
    tech: ['C#', '.NET IL', 'SSA', 'LLVM IR'],
    links: [
      { label: 'Source', href: 'https://github.com/jonathanvdc/Flame' }
    ],
    mask: {
      src: '/images/teaser-project-flame-mask.svg',
      alt: 'Flame compiler framework teaser silhouette',
      from: '#febe14ff',
      to: '#bd110cff'
    }
  },
  {
    id: 'mlir-net',
    title: 'MLIR.NET',
    subtitle: 'Typed MLIR infrastructure for .NET',
    href: '/compiler-work/mlir-net/',
    venue: 'Open source',
    impact: 'TableGen-driven typed APIs',
    role: 'Building parser, printer, IR model, and generated dialect APIs',
    blurb:
      'C# tooling for reading, writing, and working with MLIR. It uses TableGen dialect definitions to generate typed APIs.',
    tech: ['C#', 'MLIR', 'TableGen', 'ODS', 'typed IRs'],
    links: [
      { label: 'Source', href: 'https://github.com/jonathanvdc/MLIR.NET' }
    ],
    image: {
      src: '/images/teaser-project-mlir-net.svg',
      alt: 'MLIR.NET typed MLIR infrastructure teaser silhouette',
      from: '#e8d9f3ff',
      to: '#3c1f66ff'
    }
  },
  {
    id: 'julia-gpu-gc',
    title: 'Julia GPU Garbage Collection',
    subtitle: 'Runtime support for GPU languages',
    href: '/compiler-work/julia-gpu-gc/',
    venue: 'Master\'s thesis',
    impact: '2x faster than CUDA malloc baseline; thesis-prize nominated',
    role: 'Designed Julia compiler GC hooks and a GPU mark-and-sweep runtime',
    blurb:
      'My master’s thesis: adding garbage collection to Julia GPU kernels, with compiler support in Julia and a mark-and-sweep runtime on the GPU.',
    tech: ['Julia', 'LLVM IR', 'GPU', 'garbage collection', 'CUDAnative'],
    links: [
      { label: 'Thesis', href: '/files/2019-garbage-collection-abstractions-for-high-level-gpu-languages.pdf' }
    ],
    visual: 'gpu',
    image: {
      src: '/images/teaser-2019-julia.svg',
      alt: 'Julia GPU garbage collection teaser illustration',
      from: '#4063d8ff',
      to: '#9558b2ff'
    }
  },
  {
    id: 'modelverse-jit',
    title: 'Modelverse JIT',
    subtitle: 'Tiered compilation for graph bytecode',
    href: '/compiler-work/modelverse-jit/',
    venue: 'Research project',
    impact: '37x speedup over reference implementation',
    role: 'Built interpreter, baseline JIT, and optimizing SSA JIT',
    blurb:
      'A JIT compiler for the Modelverse’s graph-based bytecode. It starts with an interpreter and compiles frequently executed code using an SSA-based optimizer.',
    tech: ['JIT', 'SSA', 'bytecode', 'runtime optimization'],
    links: [
      { label: 'Report', href: '/files/2017-modelverse-jit-report.pdf' }
    ],
    mask: {
      src: '/images/teaser-2017-msdl-mask.svg',
      alt: 'Modelverse JIT teaser silhouette',
      from: '#d60000ff',
      to: '#971212ff'
    }
  },
  {
    id: 'flashfreeze',
    title: 'FlashFreeze',
    subtitle: 'JavaScript function serialization',
    href: '/compiler-work/flashfreeze/',
    venue: 'META 2019',
    impact: '3% Octane overhead vs 76% prior work',
    role: 'Designed the capture-list instrumentation and serializer',
    blurb:
      'Serializes JavaScript functions and their captured variables. Source instrumentation records the lexical environments needed to reconstruct closures.',
    tech: ['JavaScript', 'TypeScript', 'source rewriting', 'closures', 'serialization'],
    links: [
      { label: 'Paper', href: '/files/2019-flashfreeze.pdf' },
      { label: 'Source', href: 'https://github.com/nokia/ts-serialize-closures' }
    ],
    image: {
      src: '/images/teaser-flashfreeze-nokia.svg',
      alt: 'FlashFreeze JavaScript function serialization teaser',
      from: '#005affff',
      to: '#113c59ff'
    }
  }
];
