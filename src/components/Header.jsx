import { TrafficCone, FileBarChart2 } from 'lucide-react';

export default function Header({ timeFilter, setTimeFilter, onReport, onTimeFilterChange }) {
  const handleTimeFilter = (value) => {
    setTimeFilter(value);
    onTimeFilterChange?.(value);
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1>
          <TrafficCone className="header-icon" />
          Iris Mobility
        </h1>
        <span className="company-tagline">Traffic Analytics Dashboard</span>
      </div>
      <div className="header-right">
        <div className="filter-group">
          <button
            type="button"
            className={`filter-btn ${timeFilter === 'aggregated' ? 'active' : ''}`}
            onClick={() => handleTimeFilter('aggregated')}
          >
            Time Aggregated
          </button>
          <button
            type="button"
            className={`filter-btn ${timeFilter === 'time' ? 'active' : ''}`}
            onClick={() => handleTimeFilter('time')}
          >
            By Time
          </button>
        </div>
        <div className="report-buttons">
          <button type="button" className="report-btn" onClick={() => onReport('daily')}>
            <FileBarChart2 className="btn-icon" />
            Daily Report
          </button>
          <button type="button" className="report-btn" onClick={() => onReport('weekly')}>
            <FileBarChart2 className="btn-icon" />
            Weekly Report
          </button>
          <button type="button" className="report-btn" onClick={() => onReport('monthly')}>
            <FileBarChart2 className="btn-icon" />
            Monthly Report
          </button>
        </div>
      </div>
    </header>
  );
}
