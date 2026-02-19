/**
 * Parse traffic CSV rows: Timestamp, Class, Entry, Exit, Distance_m, Speed_kmh
 * Returns aggregated stats by Entry direction: { label, avgSpeedKmh, volume }
 */
function parseCsvText(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length >= 6) {
      rows.push({
        entry: (parts[2] || '').trim(),
        speedKmh: parseFloat(parts[5], 10),
      });
    }
  }
  return rows;
}

export function aggregateByEntry(rows) {
  const byEntry = {};
  const dirOrder = ['NORTH', 'SOUTH', 'EAST', 'WEST'];
  dirOrder.forEach((d) => {
    byEntry[d] = { sum: 0, count: 0 };
  });
  rows.forEach((r) => {
    const entry = r.entry?.toUpperCase?.() || r.entry;
    if (byEntry[entry]) {
      if (!Number.isNaN(r.speedKmh)) {
        byEntry[entry].sum += r.speedKmh;
        byEntry[entry].count += 1;
      }
    }
  });
  return dirOrder.map((dir) => {
    const { sum, count } = byEntry[dir];
    const avgKmh = count > 0 ? sum / count : 0;
    const avgMph = avgKmh / 1.609;
    return {
      id: dir.toLowerCase(),
      label: dir.charAt(0) + dir.slice(1).toLowerCase() + 'bound',
      avgSpeedKmh: Math.round(avgKmh * 10) / 10,
      avgSpeedMph: Math.round(avgMph * 10) / 10,
      volume: count,
    };
  });
}

export async function fetchAndParseCsv(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  const text = await res.text();
  const rows = parseCsvText(text);
  return aggregateByEntry(rows);
}
