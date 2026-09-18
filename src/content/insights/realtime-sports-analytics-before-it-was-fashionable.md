---
title: "Realtime sports analytics before it was fashionable"
description: "Realtime water polo statistics, simulation, and video analysis taught an early lesson that still applies to operations: data matters only if it changes the next decision."
date: "2026-05-01"
---

Realtime statistics during a match taught me something I still use in software design: data has to arrive while it can still change the next decision.

Sports analytics is easy to misunderstand. After the game, every number feels clean. During the game, the data is noisy, incomplete, emotional, and time-constrained. Coaches and players do not need a perfect report. They need a better decision before the next possession.

That makes the problem much closer to operations software than most people expect.

<p class="math-label">Decision Value of a Statistic</p>

$$
V(stat, t) = Impact(stat) \cdot P(action \mid stat) \cdot e^{-\lambda t}
$$

$V(stat,t)$ is the live decision value of a statistic after delay $t$.
$Impact(stat)$ measures the benefit if it is used, $P(action\mid stat)$ is the
probability that it changes a decision, and $\lambda$ controls how quickly its
value expires. The exponential term equals one at delivery and decays toward
zero with delay. A high-impact statistic can therefore have low live value if
it arrives too late or cannot suggest an action.

Game simulation gives the same lesson in another form. A match is a state process. The current score, time, fouls, possession, player fatigue, defensive shape, and shot quality all change expected outcomes.

<p class="math-label">Possession Value</p>

$$
EV(s) = \sum_a P(a \mid s) \cdot Reward(a, s)
$$

$s$ is the current game state and $a$ ranges over possible outcomes or next
actions. $P(a\mid s)$ is the probability of each outcome from that state, and
$Reward(a,s)$ is its value. Multiplying probability by reward and summing gives
expected possession value. The exact model can be simple or sophisticated.
The useful discipline is to define state, estimate transitions, and return the
conclusion quickly enough to affect judgment.

Video analysis adds a spatial layer. The same event has different meaning depending on position, spacing, timing, and defensive pressure. That is not far from route intelligence or operational monitoring. Geometry and time turn events into context.

The human side is just as important. During competition, nobody wants a lecture from a model. The information has to be small, credible, and actionable. It must respect the tempo of the environment.

That early work made me appreciate a pattern I later saw in finance, delivery, telemetry, aviation, and city systems. Realtime analytics is not about producing more numbers. It is about selecting the few signals that can change the next decision.
