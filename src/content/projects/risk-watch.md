---
title: "Risk Watch"
description: "A Rust-powered risk dashboard that separates fast market warnings from lagged private-credit evidence and shows what each score can support."
summary: "Risk Watch collects public market, macro, and filing data, then exposes private-credit stress, opportunity scores, evidence coverage, and source-level detail."
date: "2026-07-29"
externalUrl: "https://riskwatchgroup.com/"
heroImage: "/images/projects/risk-watch-dashboard.png"
heroAlt: "Risk Watch dashboard showing early-warning and confirmation signals for private-credit stress"
capabilities:
  - "Operational intelligence"
  - "Evidence-based scoring"
  - "Rust systems"
---

## Reading stress before the filings arrive

Private-credit stress rarely arrives as one clean, timely number. Traded markets
move quickly but provide proxies. Regulatory filings can reveal pressure in the
vehicles themselves, but report on an earlier period. Risk Watch keeps the two
layers distinct so a market warning is not mistaken for filed confirmation, or
a quiet market for proof that private portfolios are healthy.

The dashboard image above is a dated capture. Live readings depend on the
configured feeds and the observations they return.

## Two layers of evidence

Early warning combines high-yield and CCC spreads, bank-credit indicators,
listed BDCs, liquid credit, software equities, and leveraged-loan ETFs. These
are market and bank proxies, not direct measurements of private portfolios.

Confirmation draws on SEC vehicle disclosures and public BDC data, N-PORT
interval-fund reports, completed tender outcomes, and ICI high-yield fund
flows. Reporting periods and source links stay attached to the evidence.
Together, the layers distinguish an unconfirmed market warning, filed stress
amid calm markets, broad stress, and insufficient evidence.

## Scores with visible coverage

The dashboard shows three experimental scores across tactical, cyclical, and
structural horizons: private-credit stress, credit opportunity, and AI-equity
opportunity. Each score exposes its inputs, fixed weights, contributions,
freshness, and evidence coverage. Below 50% coverage, the card says
`Insufficient evidence` instead of displaying a score. Missing inputs do not
inherit the weight of available ones.

An evidence timeline places traded prices, official macro releases, and SEC
filings on one dated axis. A contribution waterfall reconciles the selected
score, while signal rows show source cadence, stale or unavailable readings,
raw thresholds, and active exceptions. Snapshots are stored when observations
change and streamed to connected users.

## Context beyond private credit

Separate views cover inflation and growth, Treasury and global sovereign
stress, bond and equity divergence, semiconductor breadth, and rate
sensitivity. An EIA energy panel shows crude and refined-product prices,
same-date crack-spread proxies, inventories, refining activity, and demand
proxies. Energy readings are explanatory evidence and do not enter risk scores
or alerts. The optional economic forecast is a research model and also stays
outside the scores.

## Built in Rust

An Axum server collects provider data, assembles and scores snapshots, serves
the dashboard, and sends WebSocket updates and alerts. The application and its
optional offline model trainer are Rust programs. SQLite supports a local run;
the Docker setup uses PostgreSQL with TimescaleDB and Redis. Provider caches,
retry and circuit state, replay, structured logs, Prometheus metrics, and
separate health and readiness endpoints support operation when a feed fails.

## Evidence has limits

Filed NAV marks, non-accruals, fund flows, and tender outcomes remain lagged to
their reporting periods. Public prices and bank series are proxies. The horizon
scores remain experimental until point-in-time outcomes provide enough history
to validate them.

Current-day NAV, live redemption queues, liquidity terms, borrowing
availability, covenant headroom, and vehicles without adequate public filings
still require internal administrator or portfolio feeds.
