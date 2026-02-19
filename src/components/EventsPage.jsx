import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const CLIPS = [
  { title: 'Wrong Way Event - Main St & 5th Ave', time: '2024-01-15 14:32:18', confidence: '94.2%' },
  { title: 'Red Light Run - Oak Blvd & Elm St', time: '2024-01-15 14:28:45', confidence: '91.7%' },
  { title: 'Fail to Yield - Park Ave & Broadway', time: '2024-01-15 14:25:12', confidence: '88.3%' },
  { title: 'Red Light Run - Main St & 5th Ave', time: '2024-01-15 14:19:33', confidence: '96.1%' },
  { title: 'Wrong Way Event - River Rd & Bridge St', time: '2024-01-15 14:15:07', confidence: '92.5%' },
  { title: 'Fail to Yield - Central Ave & Market St', time: '2024-01-15 14:08:22', confidence: '89.6%' },
  { title: 'Red Light Run - Oak Blvd & Elm St', time: '2024-01-15 14:02:51', confidence: '93.8%' },
];

const EVENT_LOG_RAW = [
  { ts: '2024-01-15 14:32:18', type: 'wrong-way', typeLabel: 'Wrong Way', intersection: 'Main St & 5th Ave', direction: 'Northbound', confidence: '94.2%', clip: '8s' },
  { ts: '2024-01-15 14:28:45', type: 'red-light', typeLabel: 'Red Light Run', intersection: 'Oak Blvd & Elm St', direction: 'Eastbound', confidence: '91.7%', clip: '6s' },
  { ts: '2024-01-15 14:25:12', type: 'fail-yield', typeLabel: 'Fail to Yield', intersection: 'Park Ave & Broadway', direction: 'Southbound', confidence: '88.3%', clip: '10s' },
  { ts: '2024-01-15 14:19:33', type: 'red-light', typeLabel: 'Red Light Run', intersection: 'Main St & 5th Ave', direction: 'Westbound', confidence: '96.1%', clip: '7s' },
  { ts: '2024-01-15 14:15:07', type: 'wrong-way', typeLabel: 'Wrong Way', intersection: 'River Rd & Bridge St', direction: 'Northbound', confidence: '92.5%', clip: '9s' },
  { ts: '2024-01-15 14:08:22', type: 'fail-yield', typeLabel: 'Fail to Yield', intersection: 'Central Ave & Market St', direction: 'Eastbound', confidence: '89.6%', clip: '8s' },
  { ts: '2024-01-15 14:02:51', type: 'red-light', typeLabel: 'Red Light Run', intersection: 'Oak Blvd & Elm St', direction: 'Southbound', confidence: '93.8%', clip: '6s' },
];

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='60'%3E%3Crect fill='%2322c55e' width='80' height='60'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='10'%3EHD Clip%3C/text%3E%3C/svg%3E";

const EVENT_TYPES = [
  { value: '', label: 'All Event Types' },
  { value: 'wrong-way', label: 'Wrong Way' },
  { value: 'red-light', label: 'Red Light Run' },
  { value: 'fail-yield', label: 'Fail to Yield' },
];

const INTERSECTIONS_FILTER = [
  { value: '', label: 'All Intersections' },
  { value: 'Main St & 5th Ave', label: 'Main St & 5th Ave' },
  { value: 'Oak Blvd & Elm St', label: 'Oak Blvd & Elm St' },
  { value: 'Park Ave & Broadway', label: 'Park Ave & Broadway' },
  { value: 'River Rd & Bridge St', label: 'River Rd & Bridge St' },
  { value: 'Central Ave & Market St', label: 'Central Ave & Market St' },
];

function parseDate(str) {
  const [datePart] = str.split(' ');
  return datePart; // '2024-01-15'
}

export default function EventsPage() {
  const [clipIndex, setClipIndex] = useState(0);
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [intersectionFilter, setIntersectionFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const clip = CLIPS[clipIndex];

  const filteredEvents = EVENT_LOG_RAW.filter((row) => {
    if (eventTypeFilter && row.type !== eventTypeFilter) return false;
    if (intersectionFilter && row.intersection !== intersectionFilter) return false;
    if (dateFilter && parseDate(row.ts) !== dateFilter) return false;
    return true;
  });

  const goNext = (showToast = false) => {
    const nextIdx = (clipIndex + 1) % CLIPS.length;
    setClipIndex(nextIdx);
    if (showToast) toast.success('Next clip', { description: CLIPS[nextIdx].title });
  };

  const goPrev = (showToast = false) => {
    const prevIdx = (clipIndex - 1 + CLIPS.length) % CLIPS.length;
    setClipIndex(prevIdx);
    if (showToast) toast.success('Previous clip', { description: CLIPS[prevIdx].title });
  };

  const handleRowClick = (index) => {
    const row = EVENT_LOG_RAW[index];
    const clipIdx = EVENT_LOG_RAW.indexOf(row);
    if (clipIdx >= 0) setClipIndex(clipIdx);
    toast.success('Playing clip', {
      description: `${row.typeLabel} — ${row.intersection} (${row.clip})`,
    });
  };

  useEffect(() => {
    const t = setInterval(() => setClipIndex((i) => (i + 1) % CLIPS.length), 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <div className="clips-section">
        <h2>📹 Event Clips – High Definition Playback</h2>
        <div className="video-player">
          <video autoPlay muted loop playsInline>
            <source src="" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-controls">
            <div className="video-info">
              <div id="videoTitle">{clip.title}</div>
              <div>{clip.time} • Confidence: {clip.confidence}</div>
            </div>
            <div className="video-nav">
              <button type="button" className="nav-btn" onClick={() => goPrev(true)} aria-label="Previous clip">
                ◀ Previous
              </button>
              <button type="button" className="nav-btn" onClick={() => goNext(true)} aria-label="Next clip">
                Next ▶
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h2>Event Log & Evidence</h2>
        <div className="filters-row">
          <select
            className="select"
            value={eventTypeFilter}
            onChange={(e) => {
              setEventTypeFilter(e.target.value);
              toast.info('Filter applied', {
                description: e.target.value ? EVENT_TYPES.find((o) => o.value === e.target.value)?.label : 'All event types',
              });
            }}
            aria-label="Filter by event type"
          >
            {EVENT_TYPES.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            className="select"
            value={intersectionFilter}
            onChange={(e) => {
              setIntersectionFilter(e.target.value);
              toast.info('Filter applied', {
                description: e.target.value || 'All intersections',
              });
            }}
            aria-label="Filter by intersection"
          >
            {INTERSECTIONS_FILTER.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="input-date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              toast.info('Filter applied', {
                description: e.target.value ? `Date: ${e.target.value}` : 'All dates',
              });
            }}
            aria-label="Filter by date"
          />
          {(eventTypeFilter || intersectionFilter || dateFilter) && (
            <button
              type="button"
              className="filter-btn"
              onClick={() => {
                setEventTypeFilter('');
                setIntersectionFilter('');
                setDateFilter('');
                toast.success('Filters cleared');
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Event Type</th>
              <th>Intersection</th>
              <th>Direction</th>
              <th>Confidence</th>
              <th>Snapshot</th>
              <th>Clip</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-empty">
                  No events match the current filters. Clear filters to see all.
                </td>
              </tr>
            ) : (
              filteredEvents.map((row, idx) => {
                const originalIndex = EVENT_LOG_RAW.indexOf(row);
                return (
                  <tr
                    key={originalIndex}
                    onClick={() => handleRowClick(originalIndex)}
                    className="clickable-row"
                  >
                    <td>{row.ts}</td>
                    <td><span className={`badge badge-${row.type}`}>{row.typeLabel}</span></td>
                    <td>{row.intersection}</td>
                    <td>{row.direction}</td>
                    <td>{row.confidence}</td>
                    <td><img src={PLACEHOLDER_IMG} alt="" className="event-preview" /></td>
                    <td>▶ {row.clip} clip</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
