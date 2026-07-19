---
title: "Alerting is an attention budget, not a notification feature"
description: "Base rates guarantee that most alerts on rare events are false. Operators learn that within weeks, and the channel dies unless severity is treated as a contract."
date: "2026-07-19"
---

Every alert spends operator attention, and attention does not refill during an incident.

Most teams treat alerting as additive. A failure mode appears, a rule appears. Nobody owns the total. After a year the channel carries hundreds of rules, and the operators have quietly learned which ones to skip. The engineers who wrote the rules rarely find out, because ignoring an alert leaves no trace until the day it mattered.

The base rates are against naive alerting from the start.

<p class="math-label">Alert Precision</p>

$$
P(\text{event} \mid \text{alert}) = \frac{p \cdot TPR}{p \cdot TPR + (1-p) \cdot FPR}
$$

Take a condition with prevalence `p = 0.001` per evaluation window and a detector with a 99% true-positive rate and a 1% false-positive rate. That detector sounds excellent in isolation. Its precision in production is about 9%. Ten false alarms arrive for every real one, and the operator's trust in the channel converges toward that ratio. This is the same base-rate arithmetic that medicine ran into with clinical alarms and aviation ran into with master caution philosophy. Software monitoring is rediscovering it one paging rotation at a time.

The fix is not better thresholds alone. It is treating severity as a contract. A page means a human must act within minutes. A warning means a human must see it today. An info event means the system is narrating for later forensics. Each level keeps its meaning only if every alert filed under it honors the promise. One mis-filed alert is noise; a habit of them redefines the level downward, and then the real page arrives into a room that has stopped listening.

The design rules I hold alerting to:

- an alert names the next action and the owner of that action; if no action exists, it is a log line, not an alert;
- one cause produces one alert, however many symptoms it generates; deduplication is part of detection, not a cosmetic layer;
- escalation follows persistence, not repetition — a condition that survives its expected recovery window deserves more attention, a condition that merely fires often does not;
- each rule's precision is measured in production, and rules that stay below the bar get rewritten or deleted.

Deleting an alert feels dangerous, so teams rarely do it. But an ignored alert protects nothing. It only moves the risk from the system, where it can be engineered, into the operator's attention, where it cannot.

A quiet channel that people trust beats a loud channel that people filter. The second one fails silently, which is the most expensive way an operational system can fail.
