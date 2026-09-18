---
title: "CAV-OK"
description: "Aviation weather for iPhone and iPad that turns station reports into a regional picture pilots can read at a glance."
summary: "An offline-capable aviation weather app that maps METAR observations and TAF forecasts across a pilot-defined region, then exposes the reports, trends, and route context behind the picture."
date: "2026-09-18"
heroImage: "/images/projects/cav-ok-ipad-heatmap.png"
heroAlt: "CAV-OK regional flight-category heatmap on iPad"
capabilities:
  - "Aviation weather"
  - "Geospatial computing"
  - "Offline iOS"
---

## Weather as a region, not a list

METAR and TAF reports are published one station at a time, while a pilot's
decision spans a route or a region. CAV-OK turns those point observations into
an operational map. Flight category, ceiling, visibility, wind, and estimated
cloud base can be viewed across every reporting station inside a region the
pilot centres and sizes.

The map remains useful when connectivity does not. A global basemap ships with
the app, the most recently fetched weather remains readable offline, and stale
or unavailable data is identified instead of being presented as current.

## From overview to evidence

The timeline moves through recent observations and into the TAF forecast. A
station opens into decoded conditions, the raw METAR, observation history, a
trend chart, and ATIS audio where available. Routes can be entered as airports,
fixes, or navaids, then drawn as great-circle tracks with nearby reporting
stations ordered in flight sequence.

<div class="not-prose my-10 grid grid-cols-2 gap-4">
  <img src="/images/projects/cav-ok-iphone-heatmap.png" alt="CAV-OK regional flight-category heatmap on iPhone" class="rounded-panel border border-line" loading="lazy" />
  <img src="/images/projects/cav-ok-iphone-wind.png" alt="CAV-OK wind overlay on iPhone" class="rounded-panel border border-line" loading="lazy" />
  <img src="/images/projects/cav-ok-iphone-station.png" alt="CAV-OK station details and weather trend on iPhone" class="rounded-panel border border-line" loading="lazy" />
  <img src="/images/projects/cav-ok-iphone-visibility.png" alt="CAV-OK regional visibility overlay on iPhone" class="rounded-panel border border-line" loading="lazy" />
</div>

## Interpolating the regional heatmap

CAV-OK uses Shepard inverse-distance weighting to estimate a value at each
raster pixel from the surrounding stations.

<p class="math-label">Shepard inverse-distance weighting</p>

$$
\begin{aligned}
d_i &= \lVert p-p_i \rVert \\
D &= 1 + \max_j d_j \\
w_i(p) &= \left(\frac{D-d_i}{D\max(d_i,\varepsilon)}\right)^2 \\
\hat z(p) &= \frac{\sum_i w_i(p)z_i}{\sum_i w_i(p)}
\end{aligned}
$$

Here, $p$ is the pixel being rendered, $p_i$ is station $i$, and $d_i$ is
their distance in the heatmap raster. The station's observed value is $z_i$.
$D$ is one pixel beyond the farthest station, which keeps every weight finite,
and $\varepsilon$ prevents division by zero. Squaring the weight makes nearby
stations influence the pixel much more strongly than distant ones. If a pixel
lands exactly on a station, the app uses that station's value directly.

The interpolated number is then mapped through the selected scale. Continuous
measurements use colour ramps. Flight categories use four flat colour bands so
the map does not imply categories between VFR, MVFR, IFR, and LIFR.

## Fading where evidence runs out

Interpolation should not colour an unlimited area when the nearest report is
far away. The overlay therefore fades according to the nearest station.

<p class="math-label">Distance-based opacity</p>

$$
\alpha(p)=\operatorname{clip}\left(0.55-\frac{0.55}{f}
\left(d_{\min}(p)-f\right),\ 0,\ 0.55\right), \qquad f=\frac{r}{2}
$$

$\alpha(p)$ is the pixel opacity, $d_{\min}(p)$ is the distance to the nearest
station, and $r$ is the configured station radius in pixels. Opacity stays at
55 percent until distance $f$, fades linearly after that point, and reaches
zero at $r$. `clip` prevents opacity from falling below zero or exceeding the
maximum. The visual boundary therefore communicates where local observations
stop supporting the regional estimate.

## Turning ceiling and visibility into flight category

The category overlay uses the worse of ceiling and visibility. Let $q_C(C)$ be
the severity implied by ceiling $C$ in feet and $q_V(V)$ the severity implied
by visibility $V$ in metres.

<p class="math-label">Flight-category severity</p>

$$
q(C,V)=\max\left(q_C(C),q_V(V)\right)
$$

| Category | Severity | Ceiling | Visibility |
| --- | ---: | --- | --- |
| VFR | 1 | above 3,000 ft | above 5 statute miles |
| MVFR | 2 | 1,000 to 3,000 ft | 3 to 5 statute miles |
| IFR | 3 | 500 to 999 ft | 1 to under 3 statute miles |
| LIFR | 4 | below 500 ft | below 1 statute mile |

The maximum selects the more restrictive measurement. For example, a high
ceiling cannot make a station VFR when visibility is IFR. A missing
measurement produces no category rather than treating absent evidence as good
weather. In the implementation, 1, 3, and 5 statute miles are stored as 1,609,
4,828, and 8,047 metres.

## Estimating cloud base from the spread

When temperature and dew point are available, their spread provides a rough
lifted-condensation-level estimate.

<p class="math-label">Temperature-dew-point spread</p>

$$
h_{LCL} \approx 400\left(T-T_d\right)
$$

$T$ is surface temperature in degrees Celsius, $T_d$ is dew point in degrees
Celsius, and $h_{LCL}$ is the estimated cloud base in feet above ground level.
Each degree of spread adds roughly 400 ft. This is a situational estimate, not
a replacement for a reported ceiling or an official weather briefing.

## Measuring weather along a curved Earth

A long flight leg is not a straight line in latitude and longitude. CAV-OK
uses spherical geometry to decide which stations lie inside a 50 km route
corridor.

<p class="math-label">Great-circle cross-track distance</p>

$$
d_{xt}=R\arcsin\left(\sin\delta_{13}
\sin\left(\theta_{13}-\theta_{12}\right)\right)
$$

$R$ is Earth's mean radius, $\delta_{13}=d_{13}/R$ is the angular distance
from the leg's start to the station, $\theta_{13}$ is the initial bearing from
the start to the station, and $\theta_{12}$ is the initial bearing of the
planned leg. The absolute value $|d_{xt}|$ is the shortest sideways distance
to the great-circle track. The app also computes along-track distance, clamps
it to the leg endpoints, and accumulates it across legs so stations appear in
the order the aircraft reaches them.

## Built for situational awareness

CAV-OK combines live AviationWeather.gov METAR and TAF data with a bundled
aviation reference database, offline vector and relief maps, background
refresh, a home-screen widget, and optional Finnish AWS-METAR observations.
The heatmap is computed with Metal on the GPU, with a CPU fallback, and its
raster size is bounded to fit real mobile-device memory.

The app supports preflight familiarisation and situational awareness. It is not
a certified weather source, an official briefing, or a sole source for flight
planning or in-flight decisions.
