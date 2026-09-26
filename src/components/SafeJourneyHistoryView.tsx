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
      case 'Forest / Trekking Area': return <Trees className="w-5 h-5 text-emerald-400" />;
      case 'Hill / Mountain Area': return <Mountain className="w-5 h-5 text-brand-cyan" />;
      case 'Camping Area': return <Tent className="w-5 h-5 text-amber-400" />;
      case 'Remote / Isolated Area': return <Compass className="w-5 h-5 text-emergency-500" />;
      case 'Long-Distance Travel': return <Car className="w-5 h-5 text-blue-400" />;
      default: return <MapPin className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to SafeJourney</span>
          </button>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-400" />
            <span>SafeJourney History</span>
          </h1>
          <p className="text-xs text-slate-400">
            Log of all completed journeys, safety check-ins, and alert events.
          </p>
        </div>

        <button
          onClick={onStartNew}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Trees className="w-4 h-4" />
          <span>Start New SafeJourney</span>
        </button>
      </div>

      {/* History List */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-slate-400">
          Loading journey history...
        </div>
      ) : history.length === 0 ? (
        <div className="bg-navy-900 border border-navy-750 rounded-2xl p-12 text-center space-y-3">
          <History className="w-10 h-10 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-white">No Previous Journeys Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When you complete a SafeJourney trek or trip, your check-in records and safety stats will be logged here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((j) => (
            <div
              key={j.id}
              className="p-5 rounded-2xl bg-navy-900 border border-navy-750 hover:border-emerald-500/40 transition-all space-y-4 shadow-card"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center">
                    {renderIcon(j.destinationType)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{j.destinationType}</h3>
                    {j.customDestination && (
                      <p className="text-[11px] text-slate-400">{j.customDestination}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    j.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : j.status === 'alert_triggered'
                      ? 'bg-emergency-600/20 text-emergency-500 border border-emergency-500/30'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {j.status === 'completed' ? '✓ Completed' : j.status === 'alert_triggered' ? '🚨 Alert Triggered' : 'Active'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-navy-800 text-slate-300 text-[10px] font-mono">
                    {j.isSolo ? '👤 Solo' : '👥 Group'}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-navy-850 border border-navy-750">
                  <span className="text-[10px] text-slate-500 block">START TIME</span>
                  <span className="font-mono text-white text-[11px]">
                    {new Date(j.startTime).toLocaleDateString()} {new Date(j.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-navy-850 border border-navy-750">
                  <span className="text-[10px] text-slate-500 block">SUCCESSFUL CHECKS</span>
                  <span className="font-bold text-emerald-400 text-sm">{j.totalCheckins}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-navy-850 border border-navy-750">
                  <span className="text-[10px] text-slate-500 block">MISSED CHECKS</span>
                  <span className="font-bold text-slate-300 text-sm">{j.missedCheckins}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-navy-850 border border-navy-750">
                  <span className="text-[10px] text-slate-500 block">ALERTS FIRED</span>
                  <span className={`font-bold text-sm ${j.alertsCount > 0 ? 'text-emergency-500' : 'text-slate-400'}`}>
                    {j.alertsCount}
                  </span>
                </div>
              </div>

              {/* Location info if recorded */}
              {j.lastLocation?.text && (
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Last recorded location: <strong>{j.lastLocation.text}</strong></span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
