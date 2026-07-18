// Fetches one real-world operational signal (rotating daily) and writes it to
// src/data/operational-signal.json for the homepage hero chart. Runs in CI
// before each build; on total failure the previously committed JSON is kept.
import { writeFile } from 'node:fs/promises';

const OUT = new URL('../src/data/operational-signal.json', import.meta.url);
const UA = { 'User-Agent': 'cxromos.com signal fetcher (danijel@cxromos.com)' };

async function getJson(url) {
  const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}

const dayUTC = (ms) => new Date(ms).toISOString().slice(0, 10);

function lastNDays(n) {
  const days = [];
  const today = Date.now();
  for (let i = n - 1; i >= 0; i--) days.push(dayUTC(today - i * 86_400_000));
  return days;
}

const signals = [
  {
    id: 'flights',
    label: 'Flights over Europe, west to east',
    unit: 'airborne aircraft per longitude band',
    source: 'OpenSky Network',
    async fetch() {
      const box = 'lamin=35&lomin=-15&lamax=60&lomax=30';
      const data = await getJson(`https://opensky-network.org/api/states/all?${box}`);
      const bins = 10;
      const lo = -15;
      const hi = 30;
      const counts = Array(bins).fill(0);
      for (const s of data.states ?? []) {
        const lon = s[5];
        const onGround = s[8];
        if (typeof lon !== 'number' || onGround) continue;
        const i = Math.min(bins - 1, Math.floor(((lon - lo) / (hi - lo)) * bins));
        if (i >= 0) counts[i]++;
      }
      return counts.map((v, i) => ({
        t: `${Math.round(lo + ((i + 0.5) * (hi - lo)) / bins)}°E`,
        v
      }));
    }
  },
  {
    id: 'markets',
    label: 'EUR/USD, ECB daily fix',
    unit: 'US dollars per euro',
    source: 'Frankfurter / European Central Bank',
    async fetch() {
      const start = dayUTC(Date.now() - 20 * 86_400_000);
      const data = await getJson(`https://api.frankfurter.dev/v1/${start}..?base=EUR&symbols=USD`);
      return Object.entries(data.rates)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, r]) => ({ t: date.slice(5), v: r.USD }));
    }
  },
  {
    id: 'earthquakes',
    label: 'Earthquakes M2.5+ per day',
    unit: 'events per day, worldwide',
    source: 'USGS',
    async fetch() {
      const data = await getJson('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson');
      const days = lastNDays(8);
      const counts = new Map(days.map((d) => [d, 0]));
      for (const f of data.features ?? []) {
        const d = dayUTC(f.properties.time);
        if (counts.has(d)) counts.set(d, counts.get(d) + 1);
      }
      return days.map((d) => ({ t: d.slice(5), v: counts.get(d) }));
    }
  },
  {
    id: 'wildfires',
    label: 'New wildfire events per day',
    unit: 'events per day, worldwide',
    source: 'NASA EONET',
    async fetch() {
      const data = await getJson('https://eonet.gsfc.nasa.gov/api/v3/events?category=wildfires&days=14');
      const days = lastNDays(14);
      const counts = new Map(days.map((d) => [d, 0]));
      for (const e of data.events ?? []) {
        const d = e.geometry?.[0]?.date?.slice(0, 10);
        if (d && counts.has(d)) counts.set(d, counts.get(d) + 1);
      }
      return days.map((d) => ({ t: d.slice(5), v: counts.get(d) }));
    }
  }
];

const dayOfYear = Math.floor(
  (Date.now() - Date.UTC(new Date().getUTCFullYear(), 0, 0)) / 86_400_000
);

// Rotate the signal daily; if today's source is down, fall through to the next.
// An optional CLI arg (e.g. `node scripts/fetch-signal.mjs flights`) forces one signal.
const forced = signals.findIndex((s) => s.id === process.argv[2]);
for (let attempt = 0; attempt < signals.length; attempt++) {
  const signal = signals[(forced >= 0 ? forced : dayOfYear + attempt) % signals.length];
  if (forced >= 0 && attempt > 0) break;
  try {
    const points = await signal.fetch();
    if (!points.length || points.every((p) => p.v === points[0].v)) {
      throw new Error('empty or flat series');
    }
    const payload = {
      id: signal.id,
      label: signal.label,
      unit: signal.unit,
      source: signal.source,
      updated: dayUTC(Date.now()),
      points
    };
    await writeFile(OUT, JSON.stringify(payload, null, 2) + '\n');
    console.log(`Wrote ${signal.id} signal (${points.length} points).`);
    process.exit(0);
  } catch (err) {
    console.warn(`Signal "${signal.id}" failed: ${err.message}`);
  }
}

console.warn('All signals failed; keeping existing operational-signal.json.');
