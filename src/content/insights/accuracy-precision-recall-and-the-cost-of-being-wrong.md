---
title: "Accuracy, precision, recall, and the cost of being wrong"
description: "Accuracy, precision, recall, and F1 describe different parts of detection quality. Operational systems need all four, interpreted through base rates, operator attention, and the consequences of missed events."
date: "2026-10-09"
---

A detector can be 99.9% accurate and miss every event it exists to find.

That should make anyone building operational software careful with the word "accurate." Security findings, telemetry alarms, financial risk signals, document retrieval, and AI recommendations all involve selecting something from a much larger background. Most of that background is uneventful. Getting it right can dominate the score while the useful part of the system fails.

I want evaluation to describe both the errors an operator sees and the ones the system hides. Accuracy, precision, recall, and F1 score give different views of that same behavior.

The starting point is a clear definition of a positive. In an alerting system, it might be a condition that requires intervention within a defined time window. In search, it might be a document relevant to a specific question. The evaluation unit matters: one incident producing fifty notifications should not become fifty successful detections.

<p class="math-label">Classification Outcomes</p>

$$
\begin{aligned}
TP &: \text{real positives identified} \\
FP &: \text{negatives reported as positives} \\
FN &: \text{real positives missed} \\
TN &: \text{negatives rejected}
\end{aligned}
$$

These are counts over the same evaluation set. A true positive is a relevant finding. A false positive spends attention on something that did not meet the condition. A false negative leaves a real condition undetected. A true negative is a correct rejection. The labels must come from evidence independent of the detector's own output, or the evaluation becomes circular.

<p class="math-label">Detection Metrics</p>

$$
\begin{aligned}
Accuracy &= \frac{TP + TN}{TP + FP + FN + TN} \\
Precision &= \frac{TP}{TP + FP} \\
Recall &= \frac{TP}{TP + FN} \\
F_1 &= \frac{2TP}{2TP + FP + FN}
\end{aligned}
$$

Accuracy measures the fraction of all decisions that were correct. Precision measures how many reported positives deserved the label. Recall measures how many real positives the system found. F1 is the harmonic mean of precision and recall; it falls when either is weak and excludes true negatives. A zero denominator means the metric is undefined, and the report should make that absence of evidence explicit.

Take 10,000 evaluation windows containing ten real events. A detector that reports nothing gets 9,990 true negatives and ten false negatives. Its accuracy is 99.9%, its recall and F1 are zero, and its precision is undefined because it issued no alerts. The score rewards correct silence in normal windows, even though the detector missed all ten events.

Now let the detector issue 100 alerts, eight of which correspond to real events. It has eight true positives, 92 false positives, two false negatives, and 9,898 true negatives. Accuracy is 99.06%. Recall is 80%. Precision is 8%. F1 is about 14.5%. An operator has to investigate more than twelve alerts for each real finding.

Tighten the threshold until the detector issues ten alerts, six of them correct. Precision and recall are both 60%, so F1 is 60%. Accuracy rises to 99.92%. The channel demands less attention, but the detector now misses four events instead of two. Whether that is an improvement depends on what those four events cost.

This is where I become careful with F1. It is useful for comparing detection behavior when both precision and recall matter. Its symmetric treatment of the two does not establish that false alarms and missed events have equal operational consequences. It also ignores the volume of correct rejections, the severity of each miss, and whether a correct detection arrived in time to change the decision.

A security review queue can tolerate some noise if investigation is cheap. A telemetry page wakes someone and interrupts other work. A missed financial exposure can remain invisible until a loss appears. The same confusion matrix can describe very different products.

<p class="math-label">Threshold Cost</p>

$$
C(\tau) = c_{fp} \cdot FP(\tau) + c_{fn} \cdot FN(\tau)
$$

$\tau$ is the decision threshold. $FP(\tau)$ and $FN(\tau)$ are the false-positive
and false-negative counts at that threshold, measured over the same workload.
$c_{fp}$ is the cost of a false alarm and $c_{fn}$ is the cost of a missed
event. This is a simplified cost model: incidents differ in severity, and
operator fatigue makes the cost of noise change with volume. It still forces
the team to state which consequences it is choosing to accept.

The evaluation discipline I want follows from that:

- report all four metrics with the underlying counts and event prevalence
- choose the threshold on validation data, then evaluate it on held-out data that reflects the intended workload
- inspect results by source, event severity, and operating condition, because an aggregate can conceal failure in a critical slice
- review unflagged cases as well as alerts, because recall requires evidence about missed events
- measure detection delay alongside classification quality, because a correct alert after the decision window has expired offers little protection

Knowledge systems add another obligation. If annotators disagree about what counts as relevant, the score includes that disagreement. If a provider changes its feed or the event prevalence shifts, last month's precision may no longer describe today's queue. Labels need provenance, and evaluation needs time boundaries, just as the operational data does.

I trust a detector more when the team can explain its misses than when they show me one impressive percentage. The useful quality bar is a system whose errors are measured, whose threshold reflects their consequences, and whose output an operator can act on before the opportunity passes.
