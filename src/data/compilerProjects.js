export const compilerProjects = [
  {
    id: 'foresight',
    title: 'Foresight',
    subtitle: 'Parallel equality saturation',
    href: '/compiler-work/foresight/',
    venue: 'CC 2026',
    impact: 'Up to 16x speedup',
    role: 'Designed and implemented the core system',
    blurb:
      'A parallel, extensible equality saturation library with programmable saturation strategies, generalized e-graph metadata, and deferred parallel rewriting.',
    tech: ['Scala', 'e-graphs', 'parallel rewriting', 'IR metadata'],
    links: [
      { label: 'Paper', href: '/files/2026-cc-foresight.pdf' },
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
      'Automates hardware resource allocation and sharing by combining equality saturation, algorithmic skeletons, and solver-based extraction.',
    tech: ['FPGA', 'HLS', 'equality saturation', 'solver extraction'],
    links: [
      { label: 'Paper', href: '/files/2026-cgo-skeleshare.pdf' }
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
      'Recognizes hidden BLAS and PyTorch idioms by representing programs and idioms in a minimalist functional array language.',
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
    impact: 'SSA optimizer with LLVM and Wasm back ends',
    role: 'Designed compiler IR, optimizations, and back ends',
    blurb:
      'A reusable SSA-based compiler framework for managed languages, whole-program optimization, and lowering from .NET-style programs.',
    tech: ['C#', '.NET IL', 'SSA', 'LLVM IR', 'WebAssembly'],
    links: [
      { label: 'Source', href: 'https://github.com/jonathanvdc/flame' }
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
      'Models MLIR operations, regions, attributes, and types in C#, then reconstructs ODS to generate safer dialect-specific APIs.',
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
    impact: '2x faster than CUDA malloc baseline',
    role: 'Implemented a conservative mark-and-sweep GPU GC',
    blurb:
      'Introduced compiler/runtime abstraction layers for reusable GPU garbage collection in CUDAnative.jl and Julia compiler infrastructure.',
    tech: ['Julia', 'GPU runtime', 'LLVM IR', 'garbage collection'],
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
      'A tiered just-in-time compiler for graph-based bytecode, moving hot programs from interpretation to SSA-based optimization.',
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
      'Low-overhead JavaScript instrumentation for serializing functions, closures, and captured variables by making lexical environments queryable.',
    tech: ['JavaScript', 'TypeScript', 'source rewriting', 'closures', 'serialization'],
    links: [
      { label: 'Paper', href: '/files/2019-flashfreeze.pdf' },
      { label: 'Source', href: 'https://github.com/nokia/ts-serialize-closures' }
    ],
    image: {
      src: '/images/teaser-2019-flashfreeze.png',
      alt: 'FlashFreeze JavaScript function serialization teaser',
      from: '#f0c36dff',
      to: '#113c59ff'
    }
  }
];
