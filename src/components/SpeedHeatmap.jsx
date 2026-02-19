import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { toast } from 'sonner';

// Demo coordinates for a city center (can be replaced with real intersection coordinates)
const CENTER = [40.7128, -74.006]; // New York-style center

// Simple demo data for directions around the intersection
const DIRECTION_SEGMENTS = [
  { id: 'north', label: 'Northbound', offset: [0.0012, 0], avgSpeed: 32, volume: 12450 },
  { id: 'south', label: 'Southbound', offset: [-0.0012, 0], avgSpeed: 36, volume: 10234 },
  { id: 'east', label: 'Eastbound', offset: [0, 0.0015], avgSpeed: 34, volume: 8891 },
  { id: 'west', label: 'Westbound', offset: [0, -0.0015], avgSpeed: 38, volume: 9567 },
];

function speedToColor(speed) {
  if (speed <= 25) return '#22c55e'; // green
  if (speed <= 35) return '#eab308'; // yellow
  if (speed <= 45) return '#f97316'; // orange
  return '#ef4444'; // red
}

function volumeToRadius(volume) {
  const base = Math.sqrt(volume) / 15;
  return Math.min(Math.max(base, 8), 24);
}

export default function SpeedHeatmap({ onReport }) {
  const [speedFilter, setSpeedFilter] = useState('aggregated');

  const handleReport = (type) => {
    if (onReport) {
      onReport(type);
    } else {
      const label = type === 'daily' ? 'Daily' : type === 'weekly' ? 'Weekly' : 'Monthly';
      const id = toast.loading(`Generating ${label} report for this intersection…`);
      setTimeout(() => {
        toast.success(`${label} report ready`, { id });
      }, 1800);
    }
  };

  const handleSegmentClick = (segment) => {
    toast.info(`${segment.label} speeds`, {
      description: `Avg speed ${segment.avgSpeed} mph • Volume ${segment.volume.toLocaleString()}`,
    });
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2>Speed Map by Direction</h2>
        <div className="filter-group">
          <button
            type="button"
            className={`filter-btn ${speedFilter === 'aggregated' ? 'active' : ''}`}
            onClick={() => {
              setSpeedFilter('aggregated');
              toast.info('Showing aggregated speeds by direction on the map');
            }}
          >
            Aggregated
          </button>
          <button
            type="button"
            className={`filter-btn ${speedFilter === 'time' ? 'active' : ''}`}
            onClick={() => {
              setSpeedFilter('time');
              toast.info('Time-sliced views can be wired to real data later');
            }}
          >
            By Time
          </button>
        </div>
      </div>

      <div className="chart-inner chart-inner--tall">
        <MapContainer
          center={CENTER}
          zoom={15}
          scrollWheelZoom={false}
          className="speed-map-container"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {DIRECTION_SEGMENTS.map((segment) => (
            <CircleMarker
              key={segment.id}
              center={[CENTER[0] + segment.offset[0], CENTER[1] + segment.offset[1]]}
              radius={volumeToRadius(segment.volume)}
              pathOptions={{
                color: speedToColor(segment.avgSpeed),
                fillColor: speedToColor(segment.avgSpeed),
                fillOpacity: 0.7,
                weight: 2,
              }}
              eventHandlers={{
                click: () => handleSegmentClick(segment),
              }}
            >
              <Tooltip direction="top" offset={[0, -4]} opacity={0.9} permanent={false}>
                <div>
                  <strong>{segment.label}</strong>
                  <br />
                  {segment.avgSpeed} mph • {segment.volume.toLocaleString()} vehicles
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div className="report-buttons report-buttons--center">
        <button type="button" className="report-btn" onClick={() => handleReport('daily')}>
          📊 Generate Daily Report
        </button>
        <button type="button" className="report-btn" onClick={() => handleReport('weekly')}>
          📈 Generate Weekly Report
        </button>
        <button type="button" className="report-btn" onClick={() => handleReport('monthly')}>
          📉 Generate Monthly Report
        </button>
      </div>
    </div>
  );
}
