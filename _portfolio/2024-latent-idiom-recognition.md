---
title: "Latent Idiom Recognition with Equality Saturation"
excerpt: "A compiler technique that represents array programs and library idioms in the same minimalist functional IR, then uses equality saturation to uncover hidden BLAS and PyTorch calls."
collection: portfolio
work_slug: latent-idiom-recognition
---

Latent Idiom Recognition started from a simple frustration: high-performance libraries are full of excellent implementations, but compilers only get to use them when they can recognize the right shape in the input program.

That recognition problem is more fragile than it looks.
A dot product might be written as a reduction over pairwise multiplication.
A vector sum might be expressible as a dot product against a vector of ones.
A matrix multiplication might be buried inside a higher-dimensional loop nest with transposes, constants, and array construction in the way.
Humans can often see the library call hiding inside the code.
A syntactic matcher usually cannot.

The LIAR idea was to make those hidden shapes explicit by placing both programs and idioms in the same small functional array language, then letting equality saturation search for the connection.

## The idiom is not always present syntactically

The paper's smallest example is a vector sum:

<pre class="story-code"><code>ifold N 0 (lambda acc i.
  xs[i] + acc)</code></pre>

If the target library has a `sum` function, this is easy.
But suppose the target library has `dot` and `fill`.
A human can notice that summing a vector is the same as taking the dot product with a vector of ones:

<pre class="story-code"><code>sum(xs) == dot(xs, fill(1))</code></pre>

That expression is not sitting in the original program.
The compiler has to invent the vector of ones, expose the multiplication by one, and then recognize the dot product.
This is what makes the idiom latent: the useful library call is semantically present, but not syntactically visible.

Equality saturation is a good fit for that situation because it can keep many equivalent forms alive at once.
Instead of asking a matcher to guess the one right sequence of rewrites, LIAR lets the e-graph accumulate alternatives until a library-shaped expression appears.

## A tiny IR makes the search manageable

The first design question was not the equality-saturation algorithm itself.
It was the IR.
If the IR has many array operators, every pair of operators needs rules explaining how they interact.
The paper contrasts this with prior equality-saturation work on a Lift-like array language that needed 156 rewrite rules and over 1000 lines of Scala rules.
That is a lot of machinery before getting to the actual idioms.

LIAR instead uses a minimalist functional array IR built around:

<pre class="story-code"><code>build N f       // construct an array
a[i]            // index an array
ifold N init f  // fold with access to the index</code></pre>

Together with lambda calculus, tuples, De Bruijn indices, and named function calls, those operators are expressive enough to encode the array programs we cared about.
More importantly, their semantics lead to only eight core rewrite rules.

That small rule set is the central engineering move.
It makes the e-graph search easier to understand, easier to debug, and less tied to any one target library.
BLAS and PyTorch are added as target-specific idiom rules and cost models on top of the same core language.

## Programs and idioms live in the same language

LIAR's target-specific rules describe library calls as expressions in the minimalist IR.
For BLAS, the idioms include calls such as `dot`, `axpy`, `gemv`, `gemm`, `transpose`, and `memset`.
For PyTorch, the idioms include `sum`, `dot`, `mv`, `mm`, `transpose`, `add`, `mul`, and `full`.

The important detail is that these are not separate hand-coded recognizers.
They are equalities in the same language as the input program:

<pre class="story-code"><code>dot(A, B)
  == ifold N 0 (lambda acc i.
       A[i] * B[i] + acc)

gemv(alpha, A, B, beta, C)
  == build N (lambda i.
       alpha * dot(A[i], B) + beta * C[i])</code></pre>

Once these equivalences are in the e-graph, library calls become candidates during extraction.
The extractor then uses a target-specific cost model that discounts useful library calls, nudging the final expression toward BLAS or PyTorch when doing so looks profitable.

## The search discovers progressively better programs

One of the most satisfying results in the paper is that LIAR's solutions improve over saturation steps rather than appearing all at once.

For the `gemv` kernel targeting BLAS, early extracted solutions are built out of dot products.
Later steps add vector scaling and addition through `axpy`.
Finally, the expression collapses into a full `gemv` call.
At the same time, the fraction of runtime spent inside BLAS rises from almost nothing to 100% library coverage.

That progression is exactly what I wanted from equality saturation.
The engine does not need to know in advance that the destination is `gemv`.
It can discover a path through smaller idioms and algebraic facts until the larger idiom becomes visible.

The `doitgen` benchmark is another good example.
Its loop nest does not look like a clean library call at first glance.
Targeting PyTorch, LIAR uncovers a compact matrix-multiplication expression:

<pre class="story-code"><code>build N (lambda r.
  mm(A[r], transpose(B)))</code></pre>

Targeting BLAS, it finds a `gemm`-based solution by introducing constants and zero-initialized matrices.
Those are exactly the kinds of transformations that are painful to encode as one-off compiler analyses.

## This project shaped Foresight

The original LIAR implementation did its job as a research prototype, but it also exposed the limits of the equality-saturation infrastructure I had at the time.
The work wanted a better answer to several questions:

<pre class="story-code"><code>How do we control long-running saturation?
How do we stage target-independent and target-specific rules?
How do we avoid recomputing matches we have already used?
How do we make analyses and extraction feel less bolted on?</code></pre>

Those questions eventually fed into two generations of equality-saturation engine design and, later, the development of Foresight.
In fact, one of Foresight's case studies is a reimplementation of LIAR.
That reimplementation was not just a port.
It was a test of whether a more programmable saturation engine could express the idiom-recognition workflow cleanly and run it much faster.

That history is why LIAR matters to me beyond the CGO paper.
It was the project that made equality saturation feel less like a clever optimization trick and more like infrastructure that needed real control abstractions.

## What changed

LIAR was evaluated on PolyBench/C kernels and custom linear-algebra kernels, targeting BLAS and PyTorch idioms.
The system found idioms in every evaluated kernel for both targets.
For generated C code targeting BLAS, idiom recognition produced a geometric mean speedup of 1.46x over the C references, excluding `gemver`, whose generated solutions did not complete within the run-time limit.
The best generated solution per kernel was 81% faster than reference on average.

Not every result was perfect.
Some choices exposed limitations in the cost model, and some kernels needed more saturation steps than the budget allowed.
But the compiler idea held up: a compact functional IR plus equality saturation can uncover library calls that are not syntactically present in the original program.

The clean version of the lesson is this: if programs and idioms share a small semantic language, idiom recognition becomes search rather than brittle pattern matching.
