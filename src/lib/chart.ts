export interface ChartPoint {
  x: number;
  y: number;
}

/** Scale a series into SVG coordinates (y axis inverted). */
export function scaleSeries(
  values: number[],
  x0: number,
  x1: number,
  yTop: number,
  yBottom: number
): ChartPoint[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = values.length > 1 ? (x1 - x0) / (values.length - 1) : 0;
  return values.map((v, i) => ({
    x: Math.round(x0 + i * step),
    y: Math.round(yBottom - ((v - min) / span) * (yBottom - yTop))
  }));
}

/** Smooth path through all points (Catmull-Rom converted to cubic beziers). */
export function smoothPath(pts: ChartPoint[]): string {
  if (pts.length < 2) return '';
  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${Math.round(c1x)} ${Math.round(c1y)}, ${Math.round(c2x)} ${Math.round(c2y)}, ${p2.x} ${p2.y}`;
  }
  return d;
}

/** k evenly spaced indices across a series, always including both ends. */
export function waypointIndices(length: number, k: number): number[] {
  if (length <= k) return Array.from({ length }, (_, i) => i);
  return Array.from({ length: k }, (_, i) => Math.round((i * (length - 1)) / (k - 1)));
}

/** Indices of the k largest values, excluding the given indices. */
export function peakIndices(values: number[], k: number, exclude: number[]): number[] {
  const skip = new Set(exclude);
  return values
    .map((v, i) => ({ v, i }))
    .filter(({ i }) => !skip.has(i))
    .sort((a, b) => b.v - a.v)
    .slice(0, k)
    .map(({ i }) => i);
}
