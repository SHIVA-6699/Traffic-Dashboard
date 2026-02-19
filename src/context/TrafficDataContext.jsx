import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { fetchFullWeekData } from '../data/parseTrafficCsv';

const TrafficDataContext = createContext(null);

export function TrafficDataProvider({ children }) {
  const [weekData, setWeekData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchFullWeekData(80)
      .then((data) => {
        setWeekData(data);
        toast.success('Week data loaded from CSV', {
          description: `${data.totalVehicles.toLocaleString()} vehicles (Sept 5–9)`,
        });
      })
      .catch((err) => {
        setError(err?.message || 'Failed to load CSV');
        toast.error('Could not load week stats', { description: 'Check CSV files in public folder.' });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <TrafficDataContext.Provider value={{ weekData, loading, error }}>
      {children}
    </TrafficDataContext.Provider>
  );
}

export function useTrafficData() {
  const ctx = useContext(TrafficDataContext);
  if (!ctx) throw new Error('useTrafficData must be used inside TrafficDataProvider');
  return ctx;
}
