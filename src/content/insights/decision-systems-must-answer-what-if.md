---
title: "Decision systems must answer what-if, not only what-is"
description: "Operational choices are comparisons between futures. Software that only reports current state leaves the simulation running in the operator's head, under stress, with partial data."
date: "2026-07-19"
---

A decision is a comparison between futures. Software that shows only the present forces the operator to run the comparison mentally, under time pressure, from an incomplete picture. That mental simulation is exactly the step where experienced people differ from novices, and exactly the step most operational software refuses to help with.

Aviation makes the shape of the problem concrete. A convective cell is moving toward a planned route. The options are: reroute now, delay departure, carry more fuel and accept holding, or add a stop. Each option is a counterfactual: a state the operation is not in, evaluated as if it were. Whoever decides is predicting four futures and ranking them. The software usually contributes a weather layer and silence.

<p class="math-label">Forward Model</p>

$$
s_{t+1} = f(s_t, a, w)
$$

A decision system needs some version of `f`: given current state, a candidate action `a`, and exogenous factors `w` — weather, demand, failures, the actions of others — what state follows. The model does not need to be perfect. It needs to be explicit, so its assumptions can be inspected, and cheap enough to evaluate several actions while the decision is still open.

Ranking the options is half the answer. The other half is how fragile the ranking is.

<p class="math-label">Fragility of the Winner</p>

$$
\frac{\partial J(\pi^*)}{\partial w}
$$

If the preferred option beats the runner-up by a margin that a 10-knot wind shift erases, the system should say so, because that margin is the real content of the decision. A recommendation without its sensitivity is a coin flip presented with confidence.

Building what-if into an operational product imposes requirements that pure reporting never does:

- state must be reconstructible, because you cannot simulate forward from a state you cannot pin down; this is one more reason event history and deterministic reduction matter;
- every scenario carries its assumptions as data, so two people looking at the same comparison see why the numbers differ;
- evaluation has a latency budget — a what-if that takes ten minutes is a report, and the decision will be made without it; interactive means seconds;
- the differences between scenarios are shown in operational terms (fuel, delay minutes, exposure) rather than as internal scores.

The division of labor stays the same as in the rest of my work. Deterministic engines evaluate the futures: graph, geometry, rules, physics. AI helps choose which futures are worth evaluating and explains, in the operator's language, why one beats another.

Showing the state of the operation is table stakes. Showing the consequences of the next action is the product.
