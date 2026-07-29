---
title: "Risk Watch"
description: "Private-credit stress monitoring that separates early market warnings from confirmation in regulatory disclosures and fund flows."
summary: "A live operational dashboard that collects, scores, and explains market proxies, filed vehicle evidence, and fund-flow signals without confusing coverage with certainty."
date: "2026-07-29"
externalUrl: "https://riskwatchgroup.com/"
heroImage: "/images/projects/risk-watch-dashboard.png"
heroAlt: "Risk Watch dashboard showing early-warning and confirmation signals for private-credit stress"
capabilities:
  - "Operational intelligence"
  - "Risk scoring"
  - "Real-time monitoring"
---

## The problem

Private-credit stress rarely arrives as one clean, timely number. Traded markets
can move quickly but only provide proxies. Regulatory disclosures can confirm
pressure in the vehicles themselves, but they arrive with a reporting lag. Risk
Watch was built to keep those two kinds of evidence separate, visible, and
useful without overstating what either one can prove.

## Two layers of evidence

The early-warning layer monitors public-market and macro credit conditions:
high-yield and CCC spreads, bank-credit indicators, listed BDCs, liquid credit,
software equities, and leveraged-loan ETFs.

The confirmation layer looks for filed evidence in SEC disclosures, public BDC
data sets, N-PORT interval-fund reports, completed tender outcomes, and ICI
high-yield fund flows. Together, the layers show whether market concern is
unconfirmed, whether filed stress is emerging beneath calm markets, or whether
both are deteriorating.

## From observations to decisions

Every observation retains its provider, observation time, fetch time, freshness,
and proxy status. Changed observations are scored and persisted as snapshots,
then streamed to the dashboard.

The scoring model uses fixed component weights. Missing evidence contributes no
stress and does not transfer its weight to the signals that remain. Instead, the
dashboard lowers evidence coverage and labels partial dimensions explicitly.
Operators can inspect raw thresholds, contribution reconciliation, active
exceptions, and one-day or one-week changes behind each regime.

## Built for operation

Risk Watch is a FastAPI application with live WebSocket updates, replayable
snapshots, and alert delivery. It runs locally with SQLite and supports
PostgreSQL with TimescaleDB, optional Redis pub/sub, structured logging,
Prometheus metrics, provider circuit health, and separate liveness and readiness
checks for production deployments.

Collectors poll FRED, Polygon, SEC EDGAR, SEC public BDC and N-PORT data, tender
filings, and ICI releases at source-appropriate cadences. Provider failures are
isolated, retried, and surfaced without allowing one unavailable feed to stop
the collection loop.

## Evidence has limits

Public filings can confirm reported NAV marks, non-accruals, fund flows, and
tender outcomes, but they remain lagged to their reporting periods. Public
prices and bank series are proxies, not direct observations of private-credit
portfolios.

Institution-grade monitoring still requires internal administrator or portfolio
feeds for current-day NAV, live redemption queues, liquidity terms, borrowing
availability, covenant headroom, and vehicles that do not report the needed
evidence publicly. Risk Watch makes that boundary explicit rather than filling
it with synthetic certainty.
