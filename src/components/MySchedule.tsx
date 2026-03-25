import React, { useMemo, useState } from 'react';
import { Tournament, ScheduleEvent } from '../types';
import { Trash2, Euro, X, Clock } from 'lucide-react';

interface MyScheduleProps {
  selectedTournaments: Tournament[];
  onRemove: (tournamentId: number) => void;
}

export default function MySchedule({ selectedTournaments, onRemove }: MyScheduleProps) {
  const [selectedTournamentDetail, setSelectedTournamentDetail] = useState<Tournament | null>(null);

  const timeToMinutes = (timeStr: string): number => {
    const parts = timeStr.split(/[\s:]/);
    let hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    const isPM = timeStr.toLowerCase().includes('pm');
    
    if (isPM && hours !== 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const hour12 = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    const period = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  const parseDate = (dateStr: string): string => {
    if (dateStr.includes('-')) return dateStr;
    const months: Record<string, string> = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
      'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    const parts = dateStr.split(' ');
    const month = months[parts[0]] || '03';
    const day = parseInt(parts[1]) || 1;
    return `2026-${month}-${day.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(dateStr + 'T00:00:00Z');
    return {
      day: dayNames[date.getUTCDay()],
      date: date.getUTCDate(),
      month: months[date.getUTCMonth()],
      fullDate: dateStr
    };
  };

  // Generate all days
  const allDays = useMemo(() => {
    const days: string[] = [];
    const start = new Date('2026-03-31T00:00:00Z');
    const end = new Date('2026-04-12T00:00:00Z');
    let current = new Date(start);
    while (current <= end) {
      const year = current.getUTCFullYear();
      const month = String(current.getUTCMonth() + 1).padStart(2, '0');
      const day = String(current.getUTCDate()).padStart(2, '0');
      days.push(`${year}-${month}-${day}`);
      current.setUTCDate(current.getUTCDate() + 1);
    }
    return days;
  }, []);

  // Create tournament blocks with positioning info
  const blocks = useMemo(() => {
    return selectedTournaments.map(tournament => {
      const startDateStr = tournament.flightDate || tournament.startDates[0];
      const startTimeStr = tournament.flightTime || tournament.startTimes[0];
      
      const startDate = parseDate(startDateStr);
      const startMinutes = timeToMinutes(startTimeStr);
      const startHour = Math.floor(startMinutes / 60);
      
      const dayIndex = allDays.indexOf(startDate);
      
      return {
        tournament,
        startDate,
        startTime: startTimeStr,
        dayIndex,
        startHour,
        durationHours: 6
      };
    }).filter(block => block.dayIndex !== -1);
  }, [selectedTournaments, allDays]);

  const summary = useMemo(() => {
    const totalBuyIn = selectedTournaments.reduce((sum, t) => sum + t.buyIn, 0);
    const totalEvents = selectedTournaments.length;
    return { totalBuyIn, totalEvents };
  }, [selectedTournaments]);

  const parseLevelLength = (blindLevels?: string): string => {
    if (!blindLevels) return '—';
    const match = blindLevels.match(/(\d+)-minute/);
    return match ? `${match[1]} min` : '—';
  };

  const parseStartingBlinds = (blindLevels?: string): string => {
    if (!blindLevels) return '—';
    const match = blindLevels.match(/starting at (\d+\/\d+)/);
    return match ? match[1] : '—';
  };

  const formatStack = (stack?: number): string => {
    if (!stack) return '—';
    return `${stack.toLocaleString()} chips`;
  };

  const getFormatLabel = (format: string) => {
    if (format.includes('NLH')) return 'NLHE';
    if (format.includes('PLO')) return 'PLO';
    if (format.includes('Mixed')) return 'Mixed';
    return format;
  };

  const getFormatBadgeColor = (format: string) => {
    if (format.includes('NLH')) return 'bg-blue-200 text-blue-900 border-blue-400 border-2';
    if (format.includes('PLO')) return 'bg-purple-200 text-purple-900 border-purple-400 border-2';
    if (format.includes('Mixed')) return 'bg-green-200 text-green-900 border-green-400 border-2';
    if (format.includes('Bounty')) return 'bg-red-200 text-red-900 border-red-400 border-2';
    return 'bg-yellow-200 text-yellow-900 border-yellow-400 border-2';
  };

  const formatCurrency = (amount: number) => {
    return `€${amount.toLocaleString()}`;
  };

  if (selectedTournaments.length === 0) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-xl border-4 border-gray-300 p-16 text-center shadow-lg">
          <p className="text-2xl text-gray-600 font-semibold mb-4">No tournaments selected yet</p>
          <p className="text-lg text-gray-500">Go back to the tournament list and select tournaments to build your schedule.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Box */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl border-4 border-green-400 p-6 shadow-lg">
          <p className="text-sm text-green-700 font-bold mb-2">Total Events</p>
          <p className="text-4xl font-black text-green-900">{summary.totalEvents}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl border-4 border-blue-400 p-6 shadow-lg">
          <p className="text-sm text-blue-700 font-bold mb-2">Total Investment</p>
          <p className="text-4xl font-black text-blue-900">€{summary.totalBuyIn.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl border-4 border-yellow-400 p-6 shadow-lg">
          <p className="text-sm text-yellow-700 font-bold mb-2">Hours Blocked</p>
          <p className="text-4xl font-black text-yellow-900">{summary.totalEvents * 6}h</p>
        </div>
      </div>

      {/* Simple Calendar - Built from scratch */}
      <div className="bg-white rounded-xl border-4 border-gray-300 shadow-xl p-6 overflow-x-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tournament Schedule (Gantt Chart)</h2>
        
        <div style={{ display: 'inline-block', minWidth: '100%' }}>
          {/* Header with day columns */}
          <div style={{ display: 'flex', marginBottom: '0' }}>
            {/* Time column header */}
            <div style={{ width: '60px', flexShrink: 0, padding: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '12px', borderBottom: '2px solid #1e40af' }}>
              Time
            </div>
            
            {/* Day column headers */}
            {allDays.map((dateStr, idx) => {
              const formatted = formatDate(dateStr);
              return (
                <div
                  key={`header-${idx}`}
                  style={{
                    width: '120px',
                    flexShrink: 0,
                    padding: '8px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    borderBottom: '2px solid #1e40af',
                    borderRight: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ fontSize: '10px', color: '#666' }}>{formatted.day}</div>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#1e40af' }}>{formatted.date}</div>
                  <div style={{ fontSize: '10px', color: '#666' }}>{formatted.month}</div>
                </div>
              );
            })}
          </div>

          {/* Hour rows with tournament blocks */}
          {Array.from({ length: 19 }, (_, i) => i + 6).map((hour) => (
            <div key={`hour-${hour}`} style={{ display: 'flex', borderTop: '1px solid #e5e7eb', minHeight: '60px', position: 'relative' }}>
              {/* Time label */}
              <div
                style={{
                  width: '60px',
                  flexShrink: 0,
                  padding: '8px',
                  textAlign: 'right',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  borderRight: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end'
                }}
              >
                {minutesToTime(hour * 60)}
              </div>

              {/* Day columns */}
              {allDays.map((dateStr, dayIdx) => (
                <div
                  key={`cell-${dateStr}-${hour}`}
                  style={{
                    width: '120px',
                    flexShrink: 0,
                    borderRight: '1px solid #e5e7eb',
                    backgroundColor: '#fff',
                    position: 'relative'
                  }}
                >
                  {/* Tournament blocks for this slot */}
                  {blocks
                    .filter(b => b.startDate === dateStr && b.startHour === hour)
                    .map((block, idx) => (
                      <button
                        key={`block-${block.tournament.id}`}
                        onClick={() => setSelectedTournamentDetail(block.tournament)}
                        style={{
                          position: 'absolute',
                          top: '2px',
                          left: '2px',
                          right: '2px',
                          width: 'calc(100% - 4px)',
                          height: `${block.durationHours * 60 - 4}px`,
                          padding: '6px',
                          backgroundColor: '#60a5fa',
                          backgroundImage: 'linear-gradient(to bottom right, #60a5fa, #4ade80)',
                          border: '2px solid #1e40af',
                          borderRadius: '6px',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '11px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          zIndex: 10
                        }}
                        title={`${block.tournament.name} - ${block.startTime}`}
                      >
                        <span style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          wordBreak: 'break-word'
                        }}>
                          {block.tournament.name}
                        </span>
                      </button>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Events List */}
      <div className="bg-white rounded-xl border-4 border-gray-300 shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Selected Events ({selectedTournaments.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {selectedTournaments.sort((a, b) => {
            const aDate = a.flightDate || a.startDates[0];
            const bDate = b.flightDate || b.startDates[0];
            return aDate.localeCompare(bDate);
          }).map((tournament) => (
            <div key={tournament.id} className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-300 rounded-lg p-4 shadow-md hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <button
                  onClick={() => setSelectedTournamentDetail(tournament)}
                  className="flex-1 text-left hover:text-blue-600 transition"
                >
                  <p className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm">{tournament.name}</p>
                  <div className="space-y-1 text-xs text-gray-700">
                    <p><strong>Date:</strong> {tournament.flightDate || tournament.startDates[0]}</p>
                    <p><strong>Time:</strong> {tournament.flightTime || tournament.startTimes[0]}</p>
                    <p className="flex items-center gap-1 font-bold text-blue-600">
                      <Euro className="w-3 h-3" />
                      €{tournament.buyIn}
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => onRemove(tournament.id)}
                  className="ml-2 p-2 bg-red-200 hover:bg-red-400 text-red-900 rounded-lg transition font-bold flex-shrink-0"
                  title="Remove from schedule"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tournament Detail Modal */}
      {selectedTournamentDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border-4 border-blue-400 shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Header with close button */}
            <div className="flex items-start justify-between p-6 bg-gradient-to-r from-blue-100 to-cyan-100 border-b-4 border-blue-400 sticky top-0">
              <h2 className="text-2xl font-bold text-blue-900 flex-1">{selectedTournamentDetail.name}</h2>
              <button
                onClick={() => setSelectedTournamentDetail(null)}
                className="ml-4 p-2 bg-red-400 hover:bg-red-600 text-white rounded-lg transition font-bold flex-shrink-0"
                title="Close details"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Event type badges */}
              <div className="flex flex-wrap gap-2">
                {selectedTournamentDetail.eventNum && (
                  <span className="px-3 py-1 bg-yellow-200 text-yellow-900 rounded-lg text-sm font-bold border-2 border-yellow-400">
                    Event #{selectedTournamentDetail.eventNum}
                  </span>
                )}
                {selectedTournamentDetail.eventType === 'satellite' && (
                  <span className="px-3 py-1 bg-amber-200 text-amber-900 rounded-lg text-sm font-bold border-2 border-amber-400">
                    SAT
                  </span>
                )}
                {selectedTournamentDetail.eventType === 'side' && (
                  <span className="px-3 py-1 bg-teal-200 text-teal-900 rounded-lg text-sm font-bold border-2 border-teal-400">
                    SIDE
                  </span>
                )}
                <span className={`px-4 py-2 rounded-lg text-base font-bold ${getFormatBadgeColor(selectedTournamentDetail.format)}`}>
                  {getFormatLabel(selectedTournamentDetail.format)}
                </span>
              </div>

              {/* Date & Time */}
              <div className="bg-yellow-100 px-4 py-3 rounded-lg border-2 border-yellow-400 flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-700" />
                <div>
                  <p className="text-sm text-yellow-700 font-bold">Start Time</p>
                  <p className="text-lg font-bold text-yellow-900">
                    {selectedTournamentDetail.flightDate || selectedTournamentDetail.startDates[0]} at{' '}
                    {selectedTournamentDetail.flightTime || selectedTournamentDetail.startTimes[0]}
                  </p>
                </div>
              </div>

              {/* Buy-in Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-100 px-4 py-3 rounded-lg border-2 border-green-400">
                  <p className="text-sm text-green-700 font-bold">Buy-in</p>
                  <p className="text-xl font-black text-green-900">{formatCurrency(selectedTournamentDetail.buyIn)}</p>
                </div>
                <div className="bg-cyan-100 px-4 py-3 rounded-lg border-2 border-cyan-400">
                  <p className="text-sm text-cyan-700 font-bold">Rake</p>
                  <p className="text-xl font-black text-cyan-900">{formatCurrency(selectedTournamentDetail.rakeFee)}</p>
                </div>
              </div>

              {/* Blind Levels */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-indigo-50 px-3 py-2 rounded-lg border-2 border-indigo-300">
                  <p className="text-sm text-indigo-600 font-bold">Level</p>
                  <p className="text-base text-indigo-900">{parseLevelLength(selectedTournamentDetail.blindLevels)}</p>
                </div>
                <div className="bg-orange-50 px-3 py-2 rounded-lg border-2 border-orange-300">
                  <p className="text-sm text-orange-600 font-bold">Blinds</p>
                  <p className="text-base text-orange-900">{parseStartingBlinds(selectedTournamentDetail.blindLevels)}</p>
                </div>
                <div className="bg-emerald-50 px-3 py-2 rounded-lg border-2 border-emerald-300">
                  <p className="text-sm text-emerald-600 font-bold">Stack</p>
                  <p className="text-base text-emerald-900">{formatStack(selectedTournamentDetail.startingStack)}</p>
                </div>
              </div>

              {/* Description */}
              {selectedTournamentDetail.description && (
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                  <p className="text-sm text-gray-800 leading-relaxed">{selectedTournamentDetail.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
