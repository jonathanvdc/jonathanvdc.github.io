---
title: "Flame"
excerpt: "A hobby compiler framework that grew from expression trees into an SSA CFG compiler for managed code, with block parameters, optimization passes, CIL tooling, and LLVM-oriented back ends."
collection: projects
work_slug: flame
---

Flame started before I knew I was a compiler person.
My programming path began in high school, modding video games with game-engine scripting languages.
From there I learned Visual Basic, then C#, and eventually started imagining my own C#-like language: D#.

D# had the kind of language conveniences that make perfect sense when you are learning by building: singleton classes, succinct constructors, and other small ergonomic features I wanted C# to have.
Flame was the compiler infrastructure I built to support that language.
Then, somewhere along the way, I fell in love with optimizing compilers.

That changed the center of gravity.
The last major rewrite removed the remaining traces of D# and turned Flame into a compiler framework for managed code.
The language project had been the doorway; the infrastructure became the thing I cared about.

The early versions were expression-tree oriented.
That is an appealing starting point because expression trees are easy to construct, easy to print, and easy to simplify locally.
But I wanted to do more than emit code.
I wanted to optimize generated code using the techniques I was reading about in real compilers: sparse conditional constant propagation, global value numbering, scalar replacement, inlining, and control-flow simplification.

Expression trees became the wrong abstraction.
As soon as an optimizer needs dominance, control-flow joins, mutable locals, exception edges, or stack-machine bytecode, the tree stops feeling like a compiler IR and starts feeling like a serialization format for things you wish you had modeled directly.

The big rewrite turned Flame into a control-flow graph in SSA form.
That was the moment the project became recognizably compiler-shaped.
Methods became graphs of basic blocks; instructions produced SSA values; control flow terminated each block; and values crossing control-flow edges traveled through basic block parameters rather than through ad hoc phi nodes.

<pre class="story-code"><code>entry(value, accumulator):
  if value > 1
    goto loop(value, accumulator)
  else
    goto done(accumulator)

loop(value, accumulator):
  goto entry(value - 1, value * accumulator)

done(result):
  return result</code></pre>

That example is deliberately tiny, but it captures the important design move.
Instead of treating phi nodes as a special instruction form that appears at the top of blocks, Flame treats block parameters as the receiving side of a branch.
Branches pass arguments; blocks bind parameters.
This makes SSA feel closer to a functional program with named join points, and it gave me a much cleaner mental model for transformations that rewrite control flow.

## Why managed code made this interesting

Flame targets managed-language infrastructure, especially .NET-style programs.
That means the IR cannot pretend the source language is just C with different syntax.
It has to account for object-oriented dispatch, generic methods and types, boxes, byrefs, field access, array operations, exceptions, and the CIL evaluation stack.

One lesson I learned the hard way is that a managed-code IR is not just an arithmetic IR with method calls bolted on.
The type system matters.
Flame's current documentation even calls out a design reversal from an earlier version: built-in integer types looked convenient at first, but library types such as `System.Int32` carry real behavior.
Modeling them as special compiler-only primitives made everything around the type system more awkward.

Another example is references.
In .NET, references, byrefs, object references, boxes, and ordinary pointers have different surface meanings.
For optimization, it is often more useful to make the pointer-ness explicit and let the kind of pointer carry the distinction.
That gives analyses fewer hidden cases to rediscover.

<pre class="story-code"><code>CIL stack code
  ldarg.0
  ldc.i4.1
  sub

Flame value graph
  one  = const 1
  next = sub(value, one)</code></pre>

The point of Flame IR is to turn stack effects and managed-language conventions into explicit data dependencies.
Once values are named and control-flow edges are explicit, familiar compiler machinery becomes possible: dominance, value numbering, copy propagation, inlining, scalar replacement, devirtualization, and backend-oriented lowering.

## The optimizer as a collection of pressure tests

Flame accumulated optimization passes because each pass exposed a different weakness in the IR.
Constant propagation asks whether effects are modeled clearly enough to evaluate things at compile time.
Global value numbering asks whether equivalent computations can be recognized without accidentally crossing dominance boundaries.
Scalar replacement asks whether aggregates, boxes, fields, and addresses have enough structure to be taken apart safely.
Inlining asks whether bodies can be copied without name capture, type-system surprises, or broken control flow.

<pre class="story-code"><code>analysis pressure:
  dominators
  predecessor maps
  value uses
  nullability
  liveness
  value numbering

transform pressure:
  inlining
  sparse conditional constant propagation
  global value numbering
  scalar replacement
  tail-recursion elimination
  control-flow simplification</code></pre>

One pass I am still proud of is Flame's partial scalar replacement of aggregates.
The pass is flow-sensitive: it can decompose aggregates on the paths where doing so is safe and useful, while leaving them intact on paths where the object still needs to exist as an aggregate.
It also works for reference types, not just simple value aggregates.
To the best of my knowledge, that particular combination is still unusual in production compilers.

That feedback loop is why Flame was useful even when a particular implementation detail later changed.
Every pass forced the IR to become a little less decorative and a little more load-bearing.

Tail-recursion elimination is a good example.
The optimization is simple to describe: replace a recursive call followed by a return with a jump back to the entry block.
But implementing it in a real IR asks a dozen design questions.
Can a branch pass new values to the entry block?
Can the entry block accept parameters?
Can the backend turn that shape back into reasonable CIL?
Are the old argument values still visible where they should be?

Block parameters make that transformation feel natural.
A recursive call becomes a jump with arguments.
The loop-carried state is no longer implicit in mutable locals or stack positions; it is visible on the edge.

## Tools around the framework

Flame is not just an IR package.
It grew into a small ecosystem of compiler tools and libraries:

* `Flame.Compiler` contains the core IR, analyses, and transformations.
* `Flame.Clr` imports and exports CIL, which lets Flame operate on managed assemblies.
* `ILOpt` reads a managed assembly, optimizes it, and writes an optimized assembly back out.
* `IL2LLVM` lowers managed assemblies toward LLVM IR.
* `Flame.Llvm` contains LLVM backend pieces.
* The examples include a small Brainfuck-to-CIL compiler, mostly because compiler projects are legally required to contain at least one mischievous toy language.

This gave the project a useful kind of end-to-end pressure.
It was not enough for an optimization to work on a hand-written graph.
The graph had to come from CIL, survive analyses and transformations, and then lower back into something executable.
That is where many of the less glamorous compiler lessons live.

The larger vision was an ahead-of-time optimizer for .NET programs.
That still feels like a real gap in the .NET compilation stack.
The C# compiler is primarily a language compiler, not an in-depth optimizer, and the JIT has only a small time budget.
Flame explored the space in between: take managed programs, lift them into an optimizer-friendly IR, spend more time improving them, then emit managed code or lower toward another backend.

## What Flame taught me

Flame is the project where I learned that IR design is API design.
If the representation makes the right facts explicit, analyses become smaller and transformations become less fragile.
If the representation hides important facts, every pass grows its own folklore.

It also taught me that good compiler infrastructure is rarely born clean.
The path from expression trees to SSA CFGs was not a straight line, but the mistakes were useful.
They made the later design choices feel earned: explicit control flow, explicit values, explicit type-system modeling, block parameters instead of special-case phi handling, and separate front-end, optimization, and back-end layers.

That is why Flame still matters in my portfolio.
It is not a polished paper artifact with a single focused claim.
It is the project where, in my own little universe, I tried to execute ideas that sat near the frontier of compiler engineering for managed languages.

The thing I am proudest of is the journey: starting from game scripting, inventing D#, building enough compiler infrastructure to support it, then gradually realizing that the infrastructure itself was the deeper problem.
Flame is evidence of compiler taste being built over time: trying the obvious thing, discovering where it bends, and then rebuilding the system around a better abstraction.
