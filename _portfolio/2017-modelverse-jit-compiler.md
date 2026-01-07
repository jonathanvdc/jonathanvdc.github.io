---
title: "Modelverse Just-in-Time Compiler"
excerpt: "I created a tiered just-in-time (JIT) compiler for the Modelverse!<br/>It is 37 times faster than the previous Modelverse VM.<br/><img style='width:500px;' src='/images/modelverse-performance-teaser.png'>"
collection: portfolio
---

The University of Antwerp's Faculty of Science has an optional honors program aimed at introducing second-year and third-year undergraduate students with excellent grades to the scientific world.
It does so through a series of talks, insight programs at three different research groups of one's choice, and a research project.
I was invited to and participated in the very first edition of that honors program.

I embarked on my honors program research project with [Professor Hans Vangheluwe](https://www.uantwerpen.be/en/staff/hans-vangheluwe/).
My project was to create a tiered just-in-time compiler (JIT) that converts [Modelverse](https://msdl.uantwerpen.be/git/yentl/modelverse) bytecode graphs to Python code.
  * I implemented the JIT as a new Modelverse compiler that serves as a drop-in replacement for the reference Modelverse interpreter.
  * The JIT uses a whole-function compilation strategy.
  * To execute mutable functions, the new compiler can fall back to the reference interpreter.
  * The JIT has three tiers: (1) a fast bytecode interpreter, (2) a baseline JIT
compiler, and (3) an optimizing JIT compiler that generates fast code based on
an intermediate representation in Static Single Assignment (SSA) form.
  * The new compiler tries to pick tiers for functions in a way that minimizes the sum of function run times and compile times. Initially, a heuristic picks a tier for each function. Repeated calls to the same function prompt the compiler to recompile it with a tier that generates faster code.
  * For typical Modelverse workloads, the tiered JIT is approximately 37 times faster
than the previous virtual machine.

My worked is open source and can be found on the [`jit`](https://msdl.uantwerpen.be/git/jonathanvdc/modelverse/src/jit) branch of [my Modelverse fork](https://msdl.uantwerpen.be/git/jonathanvdc/modelverse).

You can find my report [here](/files/2017-modelverse-jit-report.pdf).

<img src='/images/modelverse-performance-teaser.png'>
