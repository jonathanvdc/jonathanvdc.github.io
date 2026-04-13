---
title: "FlashFreeze, JavaScript Serializer"
excerpt: "A source-to-source compiler transform and runtime serializer for JavaScript functions, closures, cyclic object graphs, prototypes, and captured variables."
collection: portfolio
work_slug: flashfreeze
---

FlashFreeze came out of my internship at Nokia Bell Labs.
The problem sounded simple until it very much was not: move arbitrary JavaScript objects between processes or devices.

JSON handles trees of data.
Real JavaScript programs contain object graphs, prototypes, accessors, builtins, cycles, and functions.
Functions are the real trouble.
A function is not just its source text; it is source text plus the lexical environment it closes over.
JavaScript lets you ask a function for its source with `Function.prototype.toString()`, but it gives you no reflection API for asking "which variables does this function capture, and what are their current values?"

FlashFreeze was my answer to that missing reflection hook.
It is partly a source-to-source compiler transform and partly a runtime object-graph serializer.
The compiler side rewrites TypeScript/JavaScript functions so their captured variables become queryable.
The runtime side uses that metadata to serialize and reconstruct object graphs that can contain functions.

We published the result at [META 2019](/compiler-work/flashfreeze/#publication-2019-flashfreeze), co-located with SPLASH, and I got to [present the paper](/compiler-work/flashfreeze/#talk-2019-flashfreeze).
The maintained source is still available in Nokia's [`ts-serialize-closures`](https://github.com/nokia/ts-serialize-closures) repository.

## The missing operation is closure inspection

The core trick is a capture list.
For each function that captures variables from an enclosing scope, FlashFreeze attaches a small nullary function to a synthetic `__closure` property:

<pre class="story-code"><code>function twice(x) {
  return add(x, x);
}

twice.__closure = () => ({ add });</code></pre>

That `__closure` function is deliberately lazy.
It does not eagerly copy captured variables into a data structure every time they change.
It lets the JavaScript VM do what it already does well: maintain lexical environments.
When the serializer actually needs the closure, it calls `twice.__closure()` and gets an object mapping captured names to current values.

That design is why FlashFreeze had low overhead.
Most instrumented functions are just ordinary functions with one extra property.
The capture-list generator is itself a closure, so the VM's native scope machinery keeps the values reachable and up to date.
There is no shadow environment object to maintain on every write, and no runtime library has to be called every time a variable changes.

## The compiler transform is the important part

The implementation is a pair of TypeScript compiler transforms packaged as `ts-closure-transform`.
The source still reads like a compact compiler pass.
It walks the TypeScript AST, builds a lexical-scope chain, records declared names, records used identifiers, and computes which uses escape the current function's declarations.

That sounds simple, but JavaScript's binding rules make the details matter.
The transform has to distinguish `var` from `let` and `const`, because `var` declarations are hoisted while block-scoped bindings are not.
It has to avoid treating property names and type nodes as variable uses.
It has to handle function declarations, function expressions, arrow functions, parameters, destructuring patterns, and nested scopes.

The source-level idea is roughly:

<pre class="story-code"><code>visit function body
  collect declarations in this lexical scope
  collect identifier uses
  propagate unresolved uses to the parent scope
  synthesize __closure when unresolved uses remain</code></pre>

For function declarations, the transform emits a follow-up assignment after the declaration.
For function expressions and arrow functions, it uses a temporary plus the comma operator so the expression still evaluates to the original function object:

<pre class="story-code"><code>(_tmp = function(x) { return add(x, x); },
 _tmp.__closure = () => ({ add }),
 _tmp)</code></pre>

That is a nice little compiler engineering move.
The rewrite preserves expression position while still attaching metadata to the function object.
It is local, cheap, and easy for the ordinary JavaScript engine to execute.

## Serialization becomes graph traversal

Once functions can reveal their captured variables, the runtime serializer can be much simpler.
FlashFreeze represents the serialized result as a graph, not as a tree.
Each reachable value becomes a node in a serialized graph, and repeated references point back to existing nodes.
That is what lets it represent cycles and shared structure.

The runtime handles the ordinary cases first:

<pre class="story-code"><code>primitive value
array
plain object with prototype
function with source, prototype, properties, and closure
builtin by name
custom serialized value
Date and RegExp</code></pre>

Functions are serialized as source text, prototype, user-defined properties, and the serialized result of calling their `__closure` function.
Builtins such as standard library objects cannot be reconstructed from source text, so the serializer maps known builtins to names and lets the deserializer map those names back to the receiving runtime's builtins.
Object properties are serialized with descriptors when a simple enumerable writable value property is not enough, which is what makes accessors and less ordinary JavaScript objects work.

That graph representation is the part that makes FlashFreeze an object serializer rather than only a function serializer.
The closure metadata solves the missing lexical-environment problem.
The graph encoding solves JavaScript's ordinary object-identity problem.

## Deserialization rebuilds the lexical environment

Deserializing a function is the mirror image of the trick.
FlashFreeze first deserializes the function's capture list, then synthesizes a wrapper function whose parameters have the same names as the captured variables:

<pre class="story-code"><code>(function(add) {
  return (function twice(x) {
    return add(x, x);
  });
})</code></pre>

Calling that wrapper with the deserialized captured values recreates a lexical environment for the function body.
The function source is evaluated inside that environment, and the result behaves like the original function, modulo the usual restrictions around source rewriting and `eval`.

Recursive and mutually recursive closures add a small twist.
If function `f` captures `g` and `g` captures `f`, neither can be fully rebuilt first.
The runtime handles that by creating a thunk early, registering it in the deserialization map, and patching its implementation once the real function body and closure have been reconstructed.
That lets cyclic function graphs deserialize for the same reason cyclic object graphs deserialize: identity is established before all fields are populated.

This is the same shape as many serious serializers and runtimes.
Allocate placeholders first.
Fill them in later.
Do not let a cycle force recursive construction to bottom out in the wrong place.

## By-value capture needed one more compiler idea

A capture list maps names to values.
Naively, that gives each deserialized function its own copy of a captured variable.
JavaScript closures are subtler than that: multiple closures can share the same mutable captured binding.

FlashFreeze reconciles those semantics with assignment conversion.
Captured variables that are mutated are rewritten into cells: small objects whose field stores the current value.
Closures then capture the cell rather than a raw value.
After serialization and deserialization, multiple functions that used to share a mutable binding still share the same cell.

The important detail is that this conversion is selective.
Only variables that are both captured and mutated need the cell treatment.
Unmutated captures can remain simple values.
Again, the compiler transform keeps the runtime story small by making the hard semantic distinction before the program runs.

## What changed

Measured on the Octane benchmark suite, FlashFreeze's instrumentation reduced scores by only 3% on average.
The prior state-of-the-art ThingsMigrate tool lost 76%.
The work-in-progress FSM technique lost only 1%, but the paper's comparison also found that FlashFreeze was the only evaluated system that successfully instrumented the full Octane suite in a semantics-preserving way.

The file-size result was also modest: FlashFreeze grew benchmark sources by about 10% on average, compared with 55% for ThingsMigrate and 4% for FSM.
That was the trade I wanted.
FlashFreeze did not chase the absolute smallest instrumentation.
It optimized for a practical combination of low runtime overhead, precise dependency capture, broad JavaScript support, and simple serialization logic.

The limitations are honest ones.
FlashFreeze does not make arbitrary `eval` safe.
It cannot reliably support code that depends on exact source text after rewriting.
The `with` statement can break the assumption that an unqualified name denotes a lexical binding.
The maintained package also documents practical boundaries around untransformed code and class definitions unless TypeScript lowers them to ES5 functions.

But the central idea held up beautifully: if JavaScript will not expose a function's lexical environment, compile the program so each function can answer that question itself.
That is why FlashFreeze still feels like compiler work to me.
It is not "just serialization."
It is a source transform that changes what can be observed at runtime, carefully enough that the transformed program mostly continues to behave like the original.

The project also taught me a lesson I keep rediscovering in compiler systems: the best instrumentation is often lazy and structural.
Do the static work needed to expose the right hook.
Then let the runtime use its existing machinery instead of simulating the whole language in user space.

You can download the paper [here](/files/2019-flashfreeze.pdf), and the maintained implementation lives in Nokia's [`ts-serialize-closures`](https://github.com/nokia/ts-serialize-closures) repository.

<img src="/images/teaser-2019-flashfreeze.png" alt="FlashFreeze JavaScript function serialization teaser">
