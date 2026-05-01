---
title: "Aviation copilots should be constrained systems, not theatrical chat"
description: "AI becomes useful in aviation only when it is bounded by physics, regulation, routing, weather, fuel, and auditability."
date: "2026-05-01"
---

Commercial aviation made my view of AI stricter.

I do not think this is a domain where software is allowed to sound smart while hiding its work. In flight operations, technical operations, and ground operations, every suggestion lives inside a web of constraints: route validity, airport procedures, weather, fuel, aircraft limits, timing, document compliance, and human accountability.

That is why I am careful with the word "copilot." A polished chat UI is the least interesting part of the problem. The hard part is building a system that can answer three questions every time:

- what changed;
- why it matters;
- what evidence and rules support the recommendation.

The useful architecture starts with operations. I want deterministic routing, deterministic document linking, deterministic constraint checks, and explicit data lineage. Then I want AI to compress context for the operator.

The optimization target is bounded usefulness.

<p class="math-label">Decision Constraint</p>

$$
\hat{a} = \arg\min_{a \in A} \{ R(a, x_t) + \lambda U(a, x_t) \}
\quad \text{s.t.} \quad C_{reg}(a, x_t)=\mathrm{true},\; source(a)\neq\varnothing
$$

Choose an action only if it lowers risk and uncertainty inside the allowed constraint set. The `source(a)` term matters as much as the math. A recommendation without provenance has no operational weight.

Fuel is a good example because it looks simple until the system has to explain it. The fuel number is not one scalar. It is a structured operational argument.

<p class="math-label">Fuel Planning Skeleton</p>

$$
m_f = m_{trip} + m_{cont} + m_{alt} + m_{final} + m_{extra}
$$

Each term carries assumptions: route, wind, mass, altitude, alternates, contingency policy, and operational judgment. If AI summarizes a fuel impact, it should be able to say which term changed and why.

Aviation software inherits every old systems problem at once. It is realtime, distributed, mobile, geospatial, document-heavy, and audit-sensitive. A flight-planning or ops product is not a map with buttons. It is a stateful system with latency, trust, and failure modes.

Working around offline maps, 3D globe and Mercator projections, flight planners, iPad workflows, and audit-compatible mobile applications made one thing obvious to me: traceability has to be in the product design from the beginning. If a system surfaces a route change, it should identify the affected segment, the weather or airspace driver, the fuel implication, and the procedures touched by the change.

I am skeptical of unbounded LLMs in this setting for the same reason I am skeptical of dashboards that merely look sophisticated. Fluency is not evidence. If the model cannot point back to the route segment, weather product, fuel assumption, or maintenance rule that drove its answer, it has not earned operator trust.

The decomposition I trust is simple:

- graph and geospatial engines for route legality and cost;
- rules engines for operational constraints;
- realtime event infrastructure for freshness and sequencing;
- retrieval over documents and manuals for evidence;
- LLMs for summarization, translation, and operator-facing explanation.

That architecture is less glamorous than the startup pitch version of AI, but I trust it far more. In commercial aviation, the right product is not the one that appears intelligent. It is the one that remains inspectable when the situation becomes ambiguous, delayed, weather-affected, or costly.

AI in aviation should narrow the operator's search space. It should not replace the operator's judgment, and it should never hide the physics.
