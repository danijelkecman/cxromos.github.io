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
    id: 'ships',
    label: 'Ships in the North Sea & English Channel, west to east',
    unit: 'unique vessels per longitude band, 45s AIS sample',
    source: 'aisstream.io',
    async fetch() {
      const key = process.env.AISSTREAM_API_KEY;
      if (!key) throw new Error('AISSTREAM_API_KEY not set');
      const lo = -6;
      const hi = 13;
      const bins = 10;
      const seen = Array.from({ length: bins }, () => new Set());
      await new Promise((resolve, reject) => {
        const ws = new WebSocket('wss://stream.aisstream.io/v0/stream');
        const timer = setTimeout(() => {
          ws.close();
          resolve();
        }, 45_000);
        ws.onopen = () =>
          ws.send(
            JSON.stringify({
              APIKey: key,
              BoundingBoxes: [[[48, lo], [62, hi]]],
              FilterMessageTypes: ['PositionReport']
            })
          );
        ws.onmessage = async (e) => {
          try {
            const text = typeof e.data === 'string' ? e.data : await e.data.text();
            const m = JSON.parse(text);
            const mmsi = m?.MetaData?.MMSI;
            const lon = m?.MetaData?.longitude;
            if (!mmsi || typeof lon !== 'number') return;
            const i = Math.min(bins - 1, Math.max(0, Math.floor(((lon - lo) / (hi - lo)) * bins)));
            seen[i].add(mmsi);
          } catch {
            // ignore malformed frames
          }
        };
        ws.onerror = () => {
          clearTimeout(timer);
          reject(new Error('websocket error'));
        };
      });
      return seen.map((s, i) => ({
        t: `${Math.round(lo + ((i + 0.5) * (hi - lo)) / bins)}°E`,
        v: s.size
      }));
    }
  },
  {
    id: 'equities',
    label: 'S&P 500 (SPY) daily close',
    unit: 'US dollars per share',
    source: 'Polygon.io',
    async fetch() {
      const key = process.env.POLYGON_API_KEY;
      if (!key) throw new Error('POLYGON_API_KEY not set');
      const from = dayUTC(Date.now() - 30 * 86_400_000);
      const to = dayUTC(Date.now());
      const data = await getJson(
        `https://api.polygon.io/v2/aggs/ticker/SPY/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${key}`
      );
      return (data.results ?? []).map((r) => ({ t: dayUTC(r.t).slice(5), v: r.c }));
    }
  },
  {
    id: 'supply-chain',
    label: 'US freight shipments, Cass index',
    unit: 'index level, monthly, trailing 13 months',
    source: 'Cass Information Systems via FRED',
    async fetch() {
      const key = process.env.FRED_API_KEY;
      if (!key) throw new Error('FRED_API_KEY not set');
      const data = await getJson(
        `https://api.stlouisfed.org/fred/series/observations?series_id=FRGSHPUSM649NCIS&api_key=${key}&file_type=json&sort_order=desc&limit=13`
      );
      return (data.observations ?? [])
        .filter((o) => o.value !== '.')
        .reverse()
        .map((o) => ({ t: o.date.slice(2, 7), v: Number(o.value) }));
    }
  },
  {
    id: 'asteroids',
    label: 'Near-Earth asteroid passes per day',
    unit: 'close approaches per day',
    source: 'NASA NeoWs',
    async fetch() {
      const key = process.env.NASA_API_KEY;
      if (!key) throw new Error('NASA_API_KEY not set');
      const start = dayUTC(Date.now() - 7 * 86_400_000);
      const end = dayUTC(Date.now());
      const data = await getJson(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${key}`
      );
      return Object.entries(data.near_earth_objects ?? {})
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, list]) => ({ t: date.slice(5), v: list.length }));
    }
  },
  {
    id: 'storms',
    label: 'Active severe storm systems per day',
    unit: 'tracked systems per day, worldwide',
    source: 'NASA EONET',
    async fetch() {
      const data = await getJson(
        'https://eonet.gsfc.nasa.gov/api/v3/events?category=severeStorms&days=35&status=all'
      );
      const days = lastNDays(14);
      return days.map((d) => {
        let active = 0;
        for (const e of data.events ?? []) {
          const dates = (e.geometry ?? []).map((g) => g.date?.slice(0, 10)).filter(Boolean);
          if (dates.length && dates[0] <= d && d <= dates[dates.length - 1]) active++;
        }
        return { t: d.slice(5), v: active };
      });
    }
  },
  {
    id: 'floods',
    label: 'New flood events per day',
    unit: 'events per day, worldwide',
    source: 'NASA EONET',
    async fetch() {
      const data = await getJson('https://eonet.gsfc.nasa.gov/api/v3/events?category=floods&days=14&status=all');
      const days = lastNDays(14);
      const counts = new Map(days.map((d) => [d, 0]));
      for (const e of data.events ?? []) {
        const d = e.geometry?.[0]?.date?.slice(0, 10);
        if (d && counts.has(d)) counts.set(d, counts.get(d) + 1);
      }
      return days.map((d) => ({ t: d.slice(5), v: counts.get(d) }));
    }
  },
  {
    id: 'solar-flares',
    label: 'Solar flares per day',
    unit: 'GOES-observed flares per day',
    source: 'NASA DONKI',
    async fetch() {
      const key = process.env.NASA_API_KEY;
      if (!key) throw new Error('NASA_API_KEY not set');
      const start = dayUTC(Date.now() - 13 * 86_400_000);
      const end = dayUTC(Date.now());
      const data = await getJson(
        `https://api.nasa.gov/DONKI/FLR?startDate=${start}&endDate=${end}&api_key=${key}`
      );
      const days = lastNDays(14);
      const counts = new Map(days.map((d) => [d, 0]));
      for (const f of data ?? []) {
        const d = f.beginTime?.slice(0, 10);
        if (d && counts.has(d)) counts.set(d, counts.get(d) + 1);
      }
      return days.map((d) => ({ t: d.slice(5), v: counts.get(d) }));
    }
  },
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
