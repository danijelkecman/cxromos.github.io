---
title: "Route intelligence becomes real when math meets weather and fuel"
description: "In operational routing, the graph is only the beginning. The real problem is the cost surface created by weather, fuel, geometry, and time."
date: "2026-05-01"
---

A route is not a polyline. It is an optimization under uncertainty.

Offline maps, MBTiles, QGIS, Mercator projections, flight planners, and live operational constraints all point to the same conclusion: pathfinding alone is the easy part.

The graph gives you admissible motion. The value comes from the cost model.

<p class="math-label">Route Cost Functional</p>

$$
J(\pi) = \sum_{e \in \pi} (w_d d_e + w_t \Delta t_e + w_f \dot{m}_{f,e} + w_r r_e + w_c c_e)
$$

Here `\pi` is the route, `d_e` is segment distance, `\Delta t_e` is segment time, `\dot{m}_{f,e}` approximates fuel burn contribution, `r_e` is risk, and `c_e` captures hard or soft constraints such as closures, prohibited areas, or slot sensitivity. The weights are not universal constants. They represent intent. A ferry flight, a business flight, and a constrained commercial operation do not optimize the same objective.

That is why I am suspicious when route software treats routing as a purely geometric problem. In aviation, a route is shaped by winds aloft, altitude band choices, aircraft mass, climb and descent behavior, sector rules, alternates, and weather systems that evolve in time. A path that is shorter in nautical miles can still be worse in fuel, delay probability, or turbulence exposure.

There is also a physics layer that engineers sometimes underestimate.

<p class="math-label">Wind-Affected Ground Speed</p>

$$
V_g = V_{TAS} + \vec{V}_w \cdot \hat{t}
$$

The point is not the exact simplification. The point is that routing software has to acknowledge that atmosphere and aircraft performance deform the cost surface. Once that happens, the route engine becomes a decision engine rather than a drawing tool.

Map projection matters too. Mercator is conformal, which is useful visually, but scale grows with latitude. That is a bad thing to forget when geometry becomes computation.

<p class="math-label">Mercator Scale Factor</p>

$$
k(\varphi) = \sec(\varphi)
$$

I care a lot about unit discipline in this domain. Aviation routinely mixes nautical miles, knots, feet, flight levels, kilograms, pounds, pressure references, and sometimes meters. That sounds trivial until several feeds meet inside a realtime system. At that moment, unit normalization is not a display concern. It is correctness infrastructure.

The most interesting operational question is usually not "what is the route?" It is "why did this route win, and how fragile is that answer?" Good route intelligence should expose the sensitivity of the result:

- which edge contributes most to risk;
- where the fuel penalty is concentrated;
- which segment is most vulnerable to weather shifts;
- what fallback path survives if one assumption fails.

That requirement is why graph-based systems remain so powerful. They let us attach semantics to edges and nodes instead of treating them as dead geometry. An edge can carry validity periods, preferred directionality, altitude windows, weather overlap, and incremental fuel effects. Once you do that, the product can explain its decisions in a way that humans can audit.

AI still has a place here, but not in the core solver. I want the graph, geometry, and rules layers to compute the answer. Then I want AI to explain tradeoffs, summarize the reasons, and help a human inspect the result quickly.

Route intelligence is graph theory under physics, weather, economics, and time. That is why it becomes interesting.
