import { useState } from 'react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import SpeedHeatmap from './SpeedHeatmap';

const INTERSECTIONS = [
  { id: 'main-5th', name: 'Main St & 5th Ave' },
  { id: 'oak-elm', name: 'Oak Blvd & Elm St' },
  { id: 'park-broadway', name: 'Park Ave & Broadway' },
];

const VIOLATIONS = [
  { type: 'Wrong Way', value: 12, className: 'wrong-way' },
  { type: 'No Yield to Pedestrian', value: 34, className: 'no-yield' },
  { type: 'Illegal Turn', value: 28, className: 'illegal-turn' },
  { type: 'Red Light Run', value: 89, className: 'red-light' },
  { type: 'Speeding at Signal', value: 45, className: 'speeding' },
];

const DIRECTION_COUNTS = [
  { label: 'North Car', value: 12450, fill: 'var(--green-500)' },
  { label: 'South Car', value: 10234, fill: 'var(--green-500)' },
  { label: 'East Car', value: 8891, fill: 'var(--green-500)' },
  { label: 'West Car', value: 9567, fill: 'var(--green-500)' },
  { label: 'North Truck', value: 1234, fill: '#f59e0b' },
  { label: 'South Truck', value: 987, fill: '#f59e0b' },
  { label: 'North Bus', value: 456, fill: '#10b981' },
  { label: 'South Bus', value: 321, fill: '#10b981' },
];

const WRONG_WAY_TREND = [
  { day: 'Mon', count: 3 }, { day: 'Tue', count: 2 }, { day: 'Wed', count: 4 },
  { day: 'Thu', count: 5 }, { day: 'Fri', count: 3 }, { day: 'Sat', count: 2 }, { day: 'Sun', count: 1 },
];

const VIOLATION_TREND = [
  { day: 'Mon', count: 48 }, { day: 'Tue', count: 42 }, { day: 'Wed', count: 54 },
  { day: 'Thu', count: 57 }, { day: 'Fri', count: 63 }, { day: 'Sat', count: 44 }, { day: 'Sun', count: 35 },
];

export default function IntersectionPage() {
  const [selectedIntersection, setSelectedIntersection] = useState(INTERSECTIONS[0].name);

  const handleIntersectionChange = (e) => {
    const name = e.target.value;
    setSelectedIntersection(name);
    toast.success('Intersection updated', { description: name });
  };

  const handleReport = (type) => {
    const label = type === 'daily' ? 'Daily' : type === 'weekly' ? 'Weekly' : 'Monthly';
    const id = toast.loading(`Generating ${label} report for ${selectedIntersection}…`);
    setTimeout(() => {
      toast.success(`${label} report ready`, { id, description: selectedIntersection });
    }, 1800);
  };

  return (
    <>
      <div className="chart-container">
        <div className="chart-header">
          <h2>Intersection: {selectedIntersection}</h2>
          <select
            className="select"
            value={selectedIntersection}
            onChange={handleIntersectionChange}
            aria-label="Select intersection"
          >
            {INTERSECTIONS.map((opt) => (
              <option key={opt.id} value={opt.name}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <SpeedHeatmap onReport={handleReport} />

      <div className="chart-container">
        <h2>Violation Types Overview</h2>
        <div className="violations-grid">
          {VIOLATIONS.map((v) => (
            <button
              key={v.type}
              type="button"
              className={`violation-card violation-card--btn ${v.className}`}
              onClick={() =>
                toast.info(v.type, {
                  description: `${v.value} this week — tap for details`,
                })
              }
            >
              <h4>{v.type}</h4>
              <div className="value">{v.value}</div>
              <div className="change">This week</div>
            </button>
          ))}
        </div>
      </div>

      <div className="chart-container">
        <h2>Vehicle Counts by Direction & Type</h2>
        <div className="chart-inner chart-inner--tall">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={DIRECTION_COUNTS} margin={{ top: 24, right: 16, bottom: 48, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
              <XAxis dataKey="label" angle={-25} textAnchor="end" height={64} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [v.toLocaleString(), 'Count']} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {DIRECTION_COUNTS.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-container">
        <h2>Wrong-Way Count Trend (Last 7 Days)</h2>
        <div className="chart-inner chart-inner--tall">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={WRONG_WAY_TREND} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--red-500)" radius={[6, 6, 0, 0]} name="Wrong Way" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-container">
        <h2>Violation Count Trend (Last 7 Days)</h2>
        <div className="chart-inner chart-inner--tall">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={VIOLATION_TREND} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--green-500)" radius={[6, 6, 0, 0]} name="Violations" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
