---
title: "FlashFreeze: Low-Overhead JavaScript Instrumentation for Function Serialization"
authors: "Jonathan Van der Cruysse, Lode Hoste, Wolfgang Van Raemdonck"
collection: publications
permalink: /publication/2019-flashfreeze
excerpt: 'Arbitrary object serialization for JavaScript'
date: 2019-10-20
venue: 'Proceedings of the 4th ACM SIGPLAN International Workshop on Meta-Programming Techniques and Reflection, co-located with SPLASH'
paperurl: 'https://jonathanvdc.github.io/files/2019-flashfreeze.pdf'
#citation: 'Your Name, You. (2015). &quot;Paper Title Number 3.&quot; <i>Journal 1</i>. 1(3).'
---

Object serialization is important to a variety of applications, including session migration and distributed computing. A general JavaScript object serializer must support function serialization as functions are first-class objects. However, JavaScript offers no built-in function serialization and limits custom serializers by exposing no meta operator to query a function’s captured variables. Code instrumentation can expose captured variables but state-of-the-art instrumentation techniques introduce high overheads, vary in supported syntax and/or use complex (de)serialization algorithms. We introduce FlashFreeze, an instrumentation technique based on capture lists. FlashFreeze achieves a tiny run time overhead: an Octane score reduction of 3% compared to 76% for the state-of-the-art ThingsMigrate tool and 1% for the work-in-progress FSM tool. FlashFreeze supports all self-contained ECMAScript 5 programs except for specific uses of `eval`, `with`, and source code inspection. FlashFreeze’s construction gives rise to simple (de)serialization algorithms.

Download paper [here](/files/2019-flashfreeze.pdf). FlashFreeze is an open source npm module. Its source code is [here](https://github.com/nokia/ts-serialize-closures).

BibTeX citation:
```
@inproceedings{vandercruysse2019flashfreeze,
    author = {Van der Cruysse, Jonathan and Hoste, Lode and Van Raemdonck, Wolfgang},
    title = {FlashFreeze: Low-Overhead JavaScript Instrumentation for Function Serialization},
    year = {2019},
    isbn = {9781450369855},
    publisher = {Association for Computing Machinery},
    address = {New York, NY, USA},
    url = {https://doi.org/10.1145/3358502.3361268},
    doi = {10.1145/3358502.3361268},
    abstract = {Object serialization is important to a variety of applications, including session migration and distributed computing. A general JavaScript object serializer must support function serialization as functions are first-class objects. However, JavaScript offers no built-in function serialization and limits custom serializers by exposing no meta operator to query a function’s captured variables. Code instrumentation can expose captured variables but state-of-the-art instrumentation techniques introduce high overheads, vary in supported syntax and/or use complex (de)serialization algorithms. We introduce FlashFreeze, an instrumentation technique based on capture lists. FlashFreeze achieves a tiny run time overhead: an Octane score reduction of 3\% compared to 76\% for the state-of-the-art ThingsMigrate tool and 1\% for the work-in-progress FSM tool. FlashFreeze supports all self-contained ECMAScript 5 programs except for specific uses of eval, with, and source code inspection. FlashFreeze’s construction gives rise to simple (de)serialization algorithms.},
    booktitle = {Proceedings of the 4th ACM SIGPLAN International Workshop on Meta-Programming Techniques and Reflection},
    pages = {31–39},
    numpages = {9},
    keywords = {Serialization, Closures, Compilers, TypeScript, JavaScript, Instrumentation},
    location = {Athens, Greece},
    series = {META 2019}
}
```