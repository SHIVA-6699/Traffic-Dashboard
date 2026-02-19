import { toast } from 'sonner';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import StatCard from './StatCard';
import RiskHeatmap from './RiskHeatmap';

const INTERSECTIONS = [
  { rank: 1, name: 'Main St & 5th Ave', stats: '342 violations • 12 wrong-way • 89 red-light runs' },
  { rank: 2, name: 'Oak Blvd & Elm St', stats: '298 violations • 8 wrong-way • 76 red-light runs' },
  { rank: 3, name: 'Park Ave & Broadway', stats: '267 violations • 15 wrong-way • 52 red-light runs' },
  { rank: 4, name: 'River Rd & Bridge St', stats: '234 violations • 6 wrong-way • 68 red-light runs' },
  { rank: 5, name: 'Central Ave & Market St', stats: '198 violations • 9 wrong-way • 45 red-light runs' },
];

const VEHICLE_TREND = [
  { time: '12 AM', cars: 120, trucks: 40, buses: 15, motorcycles: 25 },
  { time: '4 AM', cars: 80, trucks: 25, buses: 10, motorcycles: 15 },
  { time: '8 AM', cars: 320, trucks: 180, buses: 85, motorcycles: 65 },
  { time: '12 PM', cars: 380, trucks: 220, buses: 95, motorcycles: 80 },
  { time: '4 PM', cars: 420, trucks: 200, buses: 90, motorcycles: 75 },
  { time: '8 PM', cars: 280, trucks: 120, buses: 60, motorcycles: 55 },
  { time: '12 AM', cars: 140, trucks: 50, buses: 25, motorcycles: 30 },
];

const PEDESTRIAN_DATA = [
  { label: '12 AM', value: 45 }, { label: '2 AM', value: 78 }, { label: '6 AM', value: 234 },
  { label: '8 AM', value: 1234 }, { label: '10 AM', value: 987 }, { label: '12 PM', value: 1456 },
  { label: '2 PM', value: 1567 }, { label: '4 PM', value: 1678 }, { label: '6 PM', value: 1789 },
  { label: '8 PM', value: 1123 }, { label: '10 PM', value: 567 },
];

const COLOR_PIE = [
  { name: 'White', value: 28.4, color: '#ffffff' },
  { name: 'Black', value: 22.1, color: '#1a1a1a' },
  { name: 'Red', value: 15.7, color: '#dc2626' },
  { name: 'Blue', value: 12.3, color: '#3b82f6' },
  { name: 'Gray', value: 10.8, color: '#6b7280' },
  { name: 'Yellow', value: 6.2, color: '#fbbf24' },
  { name: 'Green', value: 4.5, color: '#059669' },
];

export default function OverviewPage({ timeFilter }) {
  return (
    <>
      <div className="stats-grid">
        <StatCard title="Total Vehicles (Week)" value="847,392" change="↑ 12.3% vs last week" />
        <StatCard title="Pedestrians (Week)" value="124,583" change="↑ 5.7% vs last week" />
        <StatCard title="Violations (Week)" value="1,247" change="↓ 8.2% vs last week" />
        <StatCard title="Avg Speed" value="32.4" change="mph (within limits)" />
      </div>

      <div className="chart-container">
        <h2>Top 10 High-Risk Intersections</h2>
        <div className="intersection-list">
          {INTERSECTIONS.map((item) => (
            <button
              key={item.rank}
              type="button"
              className="intersection-item intersection-item--btn"
              onClick={() => toast.info(`#${item.rank} ${item.name}`, { description: item.stats })}
            >
              <span className="intersection-rank">{item.rank}</span>
              <div className="intersection-info">
                <div className="intersection-name">{item.name}</div>
                <div className="intersection-stats">{item.stats}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <RiskHeatmap />

      <div className="chart-container">
        <h2>Pedestrian Frequency Throughout Day</h2>
        <div className="chart-inner chart-inner--tall">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={PEDESTRIAN_DATA} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="label" width={64} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [v.toLocaleString(), 'Pedestrians']} />
              <Bar dataKey="value" fill="var(--green-500)" radius={[0, 6, 6, 0]} name="Pedestrians" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-container">
        <h2>Vehicle Classification – Multi-Line Trend</h2>
        <div className="chart-inner chart-inner--tall">
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={VEHICLE_TREND} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Area type="monotone" dataKey="cars" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Cars" />
              <Area type="monotone" dataKey="trucks" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} name="Trucks" />
              <Area type="monotone" dataKey="buses" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Buses" />
              <Area type="monotone" dataKey="motorcycles" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} name="Motorcycles" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-container pie-container">
        <h2>Color Distribution</h2>
        <div className="pie-chart-wrap">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={COLOR_PIE}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={88}
                paddingAngle={1}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}%`}
              >
                {COLOR_PIE.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="#fff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="color-legend-text">
          White 28.4% • Black 22.1% • Red 15.7% • Blue 12.3% • Gray 10.8% • Yellow 6.2% • Green 4.5%
        </p>
      </div>
    </>
  );
}
