---
title: "FlashFreeze"
excerpt: "I created an arbitrary object serializer for JavaScript.<br/>Part of my internship at Nokia Bell Labs."
collection: portfolio
---

During my internship at Nokia Bell Labs, one of the problems I was presented with was the fact that we needed to move arbitrary objects between devices, but sometimes those objects could include functions.
JavaScript has some serialization support via JSON, but it doesn't support serializing functions or non-tree data structure.

I designed FlashFreeze, a JavaScript serializer that can serialize and deserialize almost any object (minor restrictions apply), including functions.
FlashFreeze was unexpectedly rather successful: We discovered a novel construction for querying captured variables in JavaScript that we [published](/publication/2019-flashfreeze) at the META 2019 workshop, co-located with SPLASH.
I even got to [present](/talk/2019-flashfreeze) the paper!

## How it works

The main barrier to serializing functions in JavaScript is that there is no reflection operator to access a function's captured variables. (Function bodies can be queried via reflection.)
To access captured variables anyway, FlashFreeze rewrites source code to annotate functions with capture lists that describe which variables they capture.
Capture lists look like this:
```js
function f() {
    return x;
}
f.__capture_list = () => ({ x: x });
```

This implementation of capture lists has a very low overhead because it leverages the JavaScript virtual machine's optimized data structures.
Attaching a capture list to a function doesn't have a remarkably high overhead because adding a property to an object is commonplace in JavaScript.
Moreover, the capture list function has already been parsed by the virtual machine, so instantiating it prior to attaching it to its owner function shouldn't take too much work.
No data needs to be copied or kept up to date explicitly; FlashFreeze's capture lists rely on the virtual machine's scope tree to query the latest version of variables at evaluation time.

Measured on the Octane benchmark suite, we achieved a score reduction of 3% compared to 76% for the state-of-the-art ThingsMigrate tool and 1% for the work-in-progress FSM tool.

Moreover, capture lists give rise to intuitive and easy-to-implement serialization and deserialization algorithms,
which we implemented in [our open-source tool](https://github.com/nokia/ts-serialize-closures).
