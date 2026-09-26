import React, { useState, useEffect } from 'react';
import { 
  History, 
  Trees, 
  Mountain, 
  Tent, 
  Compass, 
  Car, 
  MapPin, 
  ArrowLeft
} from 'lucide-react';
import { api } from '../services/api';
import type { SafeJourney } from '../types';

interface SafeJourneyHistoryViewProps {
  onBack: () => void;
  onStartNew: () => void;
}

export const SafeJourneyHistoryView: React.FC<SafeJourneyHistoryViewProps> = ({ onBack, onStartNew }) => {
  const [history, setHistory] = useState<SafeJourney[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const data = await api.getSafeJourneyHistory();
        if (isMounted) setHistory(data);
      } catch (err) {
        console.error('Error fetching SafeJourney history:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchHistory();
    return () => { isMounted = false; };
  }, []);

  const renderIcon = (type: string) => {
    switch (type) {
      case 'Forest / Trekking Area': return <Trees className="w-5 h-5 text-emerald-600" />;
      case 'Hill / Mountain Area': return <Mountain className="w-5 h-5 text-[#E53935]" />;
      case 'Camping Area': return <Tent className="w-5 h-5 text-amber-600" />;
      case 'Remote / Isolated Area': return <Compass className="w-5 h-5 text-[#C62828]" />;
      case 'Long-Distance Travel': return <Car className="w-5 h-5 text-blue-600" />;
      default: return <MapPin className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-[#2B2020] relative z-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-red-100 pb-4">
        <div>
          <button
            onClick={onBack}
            className="text-xs text-[#806F6F] hover:text-[#2B2020] flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to SafeJourney</span>
          </button>
          <h1 className="text-2xl font-black text-[#2B2020] flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FFEFEF] text-[#E53935] flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <span>SafeJourney History</span>
          </h1>
          <p className="text-xs text-[#806F6F] mt-1">
            Log of all completed journeys, safety check-ins, and alert events.
          </p>
        </div>

        <button
          onClick={onStartNew}
          className="btn-rose-safe px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trees className="w-4 h-4 text-white" />
          <span>Start New SafeJourney</span>
        </button>
      </div>

      {/* History List */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#806F6F]">
          Loading journey history...
        </div>
      ) : history.length === 0 ? (
        <div className="glass-card-rose-solid rounded-3xl p-12 text-center space-y-3 shadow-lg">
          <History className="w-10 h-10 mx-auto text-[#806F6F]" />
          <h3 className="text-base font-bold text-[#2B2020]">No Previous Journeys Yet</h3>
          <p className="text-xs text-[#806F6F] max-w-sm mx-auto">
            When you complete a SafeJourney trek or trip, your check-in records and safety stats will be logged here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((j) => (
            <div
              key={j.id}
              className="p-6 rounded-3xl glass-card-rose-solid hover:border-red-300 transition-all space-y-4 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-red-100 flex items-center justify-center shadow-sm">
                    {renderIcon(j.destinationType)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2B2020]">{j.destinationType}</h3>
                    {j.customDestination && (
                      <p className="text-[11px] text-[#806F6F]">{j.customDestination}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    j.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : j.status === 'alert_triggered'
                      ? 'bg-[#FFEFEF] text-[#C62828] border border-red-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {j.status === 'completed' ? '✓ Completed' : j.status === 'alert_triggered' ? '🚨 Alert Triggered' : 'Active'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white text-[#2B2020] border border-red-100 text-[10px] font-mono">
                    {j.isSolo ? '👤 Solo' : '👥 Group'}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-white/80 border border-red-100">
                  <span className="text-[10px] text-[#806F6F] block font-semibold">START TIME</span>
                  <span className="font-mono text-[#2B2020] text-[11px] font-bold">
                    {new Date(j.startTime).toLocaleDateString()} {new Date(j.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white/80 border border-red-100">
                  <span className="text-[10px] text-[#806F6F] block font-semibold">SUCCESSFUL CHECKS</span>
                  <span className="font-bold text-emerald-700 text-sm">{j.totalCheckins}</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/80 border border-red-100">
                  <span className="text-[10px] text-[#806F6F] block font-semibold">MISSED CHECKS</span>
                  <span className="font-bold text-[#2B2020] text-sm">{j.missedCheckins}</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/80 border border-red-100">
                  <span className="text-[10px] text-[#806F6F] block font-semibold">ALERTS FIRED</span>
                  <span className={`font-bold text-sm ${j.alertsCount > 0 ? 'text-[#E53935]' : 'text-[#806F6F]'}`}>
                    {j.alertsCount}
                  </span>
                </div>
              </div>

              {/* Location info if recorded */}
              {j.lastLocation?.text && (
                <div className="text-[11px] text-[#806F6F] flex items-center gap-1.5 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E53935]" />
                  <span>Last Location: {j.lastLocation.text}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
