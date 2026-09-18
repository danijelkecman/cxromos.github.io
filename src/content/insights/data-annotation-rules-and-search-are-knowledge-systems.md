---
title: "Data annotation, rules, and search are knowledge systems"
description: "Large data processing, NLP, Lucene, Solr, business rules, and provider integration turn software into a knowledge system, not just a database pipeline."
date: "2026-05-01"
---

Large data systems become interesting when the data does not arrive with clean meaning attached.

Market information, risk data, map data, provider feeds, natural language, annotations, and legacy records all have this problem. The technical work may involve Lucene, Solr, NLP, business rules, data integration, and parallel processing, but the deeper problem is knowledge formation.

Raw data is not knowledge. It becomes knowledge only after the system can classify it, connect it, explain it, and preserve provenance.

<p class="math-label">Knowledge Construction</p>

$$
K = normalize(raw) + annotate(raw) + link(raw, context) + provenance(raw)
$$

$raw$ is the source record and $K$ is the usable knowledge produced from it.
The four functions standardise the record, attach classifications, connect it
to relevant context, and retain its origin. The plus signs mean composition of
evidence, not numeric addition. The formula is informal, but the engineering
point is concrete. If any term is missing, especially provenance, the pipeline
may still produce search results but cannot explain why they deserve trust.

Business rules engines are useful because they make part of the reasoning explicit.

<p class="math-label">Hybrid Reasoning</p>

$$
y = f_{rules}(x) + f_{model}(x) + \epsilon
$$

$x$ is the input record and $y$ is the resulting classification or decision.
$f_{rules}$ is the deterministic contribution from explicit rules,
$f_{model}$ is the contribution from a statistical or language model, and
$\epsilon$ collects error and unexplained variation. The plus signs describe a
hybrid decision, not necessarily literal arithmetic. Rules give determinism
and auditability, while models give flexibility over messy language. Good
systems expose the remaining error through confidence, source, and decision
trace.

Map and location data make this particularly clear. Data from many providers may describe the same real-world object using different names, geometry, classifications, and freshness. The integration problem is not simply "merge rows." It is entity resolution under disagreement.

<p class="math-label">Entity Resolution</p>

$$
P(e_i = e_j \mid features, source, time) > \tau
$$

$e_i$ and $e_j$ are records that may describe the same real-world entity. The
probability is conditioned on their matching features, provider reliability,
and observation time. $\tau$ is the acceptance threshold: above it the records
are linked, below it they remain separate. Set $\tau$ too low and the system
merges different things. Set it too high and one entity fragments into several
records. Every threshold encodes a product decision.

Search systems reveal the same tension. Indexing is not storage. Ranking is not neutrality. Tokenization, stemming, synonyms, field boosts, recency, and authority all shape what users believe the system knows.

That is why I like knowledge systems that are modest about their own certainty. They expose the rule, source, confidence, and time of the conclusion. They let humans inspect the chain from raw input to operational answer.

When data comes from many places, architecture is epistemology. The software has to decide how it knows what it knows.
