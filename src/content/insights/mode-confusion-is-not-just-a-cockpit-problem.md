---
title: "Mode confusion is not just a cockpit problem"
description: "Automation surprise happens when the system's actual mode diverges from the operator's model of it. Autopilots taught this lesson decades before auto-scaling and sync engines repeated it."
date: "2026-07-19"
---

Aviation named this problem in the 1980s. Earl Wiener's questions about cockpit automation — what is it doing, why is it doing that, what will it do next — came out of crews being surprised by autopilots that were working exactly as designed. I hear engineers ask the same three questions today about auto-scaling groups, retry policies, failover logic, and sync engines.

Mode confusion is a specific failure: the automation behaves according to its actual mode while the human predicts according to an assumed one. Neither party is wrong by its own rules. The accident happens in the gap between them.

<p class="math-label">Model Divergence</p>

$$
d_{t+1} = d_t + \operatorname{drift}(a_t) - \operatorname{evidence}(y_t)
$$

This is a design instinct, not a law. Every silent automatic transition adds drift between the system's state and the operator's model of it. Every observable, attributable state change removes some. A system whose transitions are mostly silent guarantees that divergence grows until something forces a correction, usually an incident.

The software versions are everywhere once you look for them. A failover that switches regions without announcing itself, so latency graphs change shape and nobody knows why. A sync engine that resolves a write conflict by policy but records nothing, so a field appears to revert on its own. A retry layer that turns one user action into five requests, so downstream metrics describe traffic that no human generated. A rollback automation that flips a feature flag during the night. In each case the system did what it was built to do, and the operator spends the incident debugging the automation instead of the fault.

The design consequences I take from aviation's experience:

- every automated transition is announced where the operator actually looks, not buried in a log they would have to know to search;
- the current policy is inspectable at any moment: the system can answer "what will you do next" before it acts;
- every automated action carries its trigger, so "why did it do that" has a recorded answer;
- in high-consequence loops, predictable automation beats clever automation, even when clever wins on benchmarks.

The last rule costs something. An adaptive policy usually outperforms a fixed one on average. But average performance is measured on quiet days, and predictability is a property that only pays out during failures, which is when the operator's model of the system is the load-bearing component.

An automation the operator cannot predict is one more system to supervise. Since supervision was the workload the automation was supposed to remove, an unpredictable automation has a net value that is easy to overestimate and sometimes negative.
