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

$s_t$ is the current state, $a$ is one candidate action, and $w$ contains
external factors such as weather, demand, failures, and the actions of others.
The forward model $f$ combines them to estimate the next state $s_{t+1}$. A
decision system evaluates the same starting state under several values of $a$
so their consequences can be compared. The model does not need to be perfect.
It needs explicit assumptions and must be cheap enough to run while the
decision is still open.

Ranking the options is half the answer. The other half is how fragile the ranking is.

<p class="math-label">Fragility of the Winner</p>

$$
\frac{\partial J(\pi^*)}{\partial w}
$$

$J$ is the cost or value assigned to a policy, $\pi^*$ is the currently
preferred policy, and $w$ is an external assumption. The partial derivative
measures how quickly the winner's score changes when that assumption moves
while the others are held fixed. A large magnitude means the recommendation is
fragile. If a 10-knot wind shift erases the winner's margin, the system should
say so. A recommendation without its sensitivity is a coin flip presented with
confidence.

Building what-if into an operational product imposes requirements that pure reporting never does:

- state must be reconstructible, because you cannot simulate forward from a state you cannot pin down; this is one more reason event history and deterministic reduction matter
- every scenario carries its assumptions as data, so two people looking at the same comparison see why the numbers differ
- evaluation has a latency budget - a what-if that takes ten minutes is a report, and the decision will be made without it; interactive means seconds
- the differences between scenarios are shown in operational terms (fuel, delay minutes, exposure) rather than as internal scores

The division of labor stays the same as in the rest of my work. Deterministic engines evaluate the futures: graph, geometry, rules, physics. AI helps choose which futures are worth evaluating and explains, in the operator's language, why one beats another.

Showing the state of the operation is table stakes. Showing the consequences of the next action is the product.
