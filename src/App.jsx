import { useState } from 'react';
import { toast } from 'sonner';
import { Globe2, MapPinned, Video } from 'lucide-react';
import { TrafficDataProvider } from './context/TrafficDataContext';
import Header from './components/Header';
import OverviewPage from './components/OverviewPage';
import IntersectionPage from './components/IntersectionPage';
import EventsPage from './components/EventsPage';
import './App.css';

const TABS = [
  { id: 'overview', label: 'City Overview', icon: Globe2 },
  { id: 'intersection', label: 'Intersection Detail', icon: MapPinned },
  { id: 'events', label: 'Events & Evidence', icon: Video },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeFilter, setTimeFilter] = useState('aggregated');

  const handleReport = (type) => {
    const label = type === 'daily' ? 'Daily' : type === 'weekly' ? 'Weekly' : 'Monthly';
    const id = toast.loading(`Generating ${label} report…`);
    setTimeout(() => {
      toast.success(`${label} report ready`, {
        id,
        description: 'Charts and analytics are included. Export to Excel when you connect your data.',
      });
    }, 1800);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const label = TABS.find((t) => t.id === tabId)?.label ?? tabId;
    toast.success(label, { description: 'View updated', duration: 2000 });
  };

  return (
    <TrafficDataProvider>
    <div className="dashboard-wrap">
      <div className="container">
        <Header
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          onReport={handleReport}
          onTimeFilterChange={(v) => toast.info(v === 'aggregated' ? 'Showing time-aggregated data' : 'Showing data by time')}
        />

        <nav className="tabs" role="tablist" aria-label="Dashboard sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.icon && <tab.icon className="tab-icon" />}
              {tab.label}
            </button>
          ))}
        </nav>

        <main>
          <div
            id="panel-overview"
            role="tabpanel"
            aria-labelledby="tab-overview"
            hidden={activeTab !== 'overview'}
            className={`page ${activeTab === 'overview' ? 'active' : ''}`}
          >
            {activeTab === 'overview' && <OverviewPage timeFilter={timeFilter} />}
          </div>
          <div
            id="panel-intersection"
            role="tabpanel"
            aria-labelledby="tab-intersection"
            hidden={activeTab !== 'intersection'}
            className={`page ${activeTab === 'intersection' ? 'active' : ''}`}
          >
            {activeTab === 'intersection' && <IntersectionPage />}
          </div>
          <div
            id="panel-events"
            role="tabpanel"
            aria-labelledby="tab-events"
            hidden={activeTab !== 'events'}
            className={`page ${activeTab === 'events' ? 'active' : ''}`}
          >
            {activeTab === 'events' && <EventsPage />}
          </div>
        </main>
      </div>
    </div>
    </TrafficDataProvider>
  );
}
