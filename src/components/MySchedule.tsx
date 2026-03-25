import React, { useMemo, useState } from 'react';
import { Tournament, ScheduleEvent } from '../types';
import { Trash2, Euro, X, Clock } from 'lucide-react';

interface MyScheduleProps {
  selectedTournaments: Tournament[];
  onRemove: (tournamentId: number) => void;
}

export default function MySchedule({ selectedTournaments, onRemove }: MyScheduleProps) {
  const [selectedTournamentDetail, setSelectedTournamentDetail] = useState<Tournament | null>(null);

  // Parse time string "12:00 PM" to minutes since midnight
  const timeToMinutes = (timeStr: string): number => {
    const parts = timeStr.split(/[\s:]/);
    let hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    const isPM = timeStr.toLowerCase().includes('pm');
    
    if (isPM && hours !== 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
  };

  // Convert minutes to formatted time string
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const hour12 = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    const period = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  // Parse date string "2026-03-31" or "Mar 31"
  const parseDate = (dateStr: string): Date => {
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    const months: Record<string, number> = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    const parts = dateStr.split(' ');
    const month = months[parts[0]] || 2;
    const day = parseInt(parts[1]) || 1;
    return new Date(2026, month, day);
  };

  // Create schedule events
  const scheduleEvents: ScheduleEvent[] = useMemo(() => {
    return selectedTournaments.map(tournament => {
      const startDateStr = tournament.flightDate || tournament.startDates[0];
      const startTimeStr = tournament.flightTime || tournament.startTimes[0];
      
      const startDate = parseDate(startDateStr);
      const startMinutes = timeToMinutes(startTimeStr);
      
      // Calculate end time (6 hours = 360 minutes)
      const endMinutes = startMinutes + 360;
      const endDate = new Date(startDate);
      
      if (endMinutes >= 24 * 60) {
        endDate.setDate(endDate.getDate() + 1);
      }
      
      const endHours = Math.floor((endMinutes % (24 * 60)) / 60);
      const endMins = endMinutes % 60;
      const endTimeStr = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
      
      return {
        tournament,
        startDate: startDateStr,
        startTime: startTimeStr,
        endDate: endDate.toISOString().split('T')[0],
        endTime: endTimeStr,
        durationHours: 6
      };
    });
  }, [selectedTournaments]);

  // Generate array of all days from Mar 31 to Apr 12, 2026
  const allDays = useMemo(() => {
    const days: Date[] = [];
    const startDate = new Date(2026, 2, 31); // March 31
    const endDate = new Date(2026, 3, 12); // April 12
    
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  }, []);

  // Calculate summary
  const summary = useMemo(() => {
    const totalBuyIn = selectedTournaments.reduce((sum, t) => sum + t.buyIn, 0);
    const totalEvents = selectedTournaments.length;
    return { totalBuyIn, totalEvents };
  }, [selectedTournaments]);

  const formatDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return {
      day: dayNames[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      fullDate: date.toISOString().split('T')[0]
    };
  };

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

  // Get event for a specific day and time slot
  const getEventForSlot = (dateStr: string, hour: number): ScheduleEvent | null => {
    return scheduleEvents.find(event => {
      if (event.startDate !== dateStr) return false;
      const eventStartMin = timeToMinutes(event.startTime);
      const eventEndMin = eventStartMin + 360; // 6 hours = 360 minutes
      
      const hourStartMin = hour * 60;
      const hourEndMin = (hour + 1) * 60;
      
      // Check if event overlaps with this hour
      return eventStartMin < hourEndMin && eventEndMin > hourStartMin;
    }) || null;
  };

  // Check if this is the first hour of an event (to avoid duplicate blocks)
  const isFirstHourOfEvent = (dateStr: string, hour: number, event: ScheduleEvent): boolean => {
    const eventStartMin = timeToMinutes(event.startTime);
    const hourStartMin = hour * 60;
    // First hour is when event starts in this hour slot
    return eventStartMin >= hourStartMin && eventStartMin < (hourStartMin + 60);
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

      {/* Gantt-style Schedule - Table based */}
      <div className="bg-white rounded-xl border-4 border-gray-300 shadow-xl p-6 overflow-x-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tournament Schedule (Gantt Chart)</h2>
        
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gradient-to-b from-blue-200 to-blue-100">
              <th className="border-2 border-gray-400 bg-gray-100 p-2 w-24 font-bold text-gray-800 text-center">Time</th>
              {allDays.map((day, idx) => {
                const formatted = formatDate(day);
                return (
                  <th key={`header-${idx}`} className="border-2 border-gray-400 p-2 w-32 font-bold">
                    <div className="text-center">
                      <div className="text-gray-900 text-xs">{formatted.day}</div>
                      <div className="text-lg font-black text-blue-700">{formatted.date}</div>
                      <div className="text-xs text-gray-700">{formatted.month}</div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 19 }, (_, i) => i + 6).map((hour) => {
              // Track which tournaments have blocks starting in this row
              const tournamentsInRow: { [key: string]: ScheduleEvent } = {};
              
              allDays.forEach(day => {
                const dateStr = day.toISOString().split('T')[0];
                const event = getEventForSlot(dateStr, hour);
                if (event && isFirstHourOfEvent(dateStr, hour, event)) {
                  tournamentsInRow[dateStr] = event;
                }
              });

              return (
                <tr key={`hour-${hour}`} style={{ height: '30px' }} className="relative">
                  {/* Time label */}
                  <td className="border-2 border-gray-400 bg-gray-100 p-1 font-bold text-center text-gray-800 w-24 align-top">
                    {minutesToTime(hour * 60)}
                  </td>

                  {/* Day cells */}
                  {allDays.map((day) => {
                    const dateStr = day.toISOString().split('T')[0];
                    const event = tournamentsInRow[dateStr];

                    return (
                      <td
                        key={`cell-${dateStr}-${hour}`}
                        className="border-2 border-gray-300 p-1 bg-white hover:bg-gray-50 relative w-32 align-top"
                        style={event ? { height: '180px' } : undefined}
                      >
                        {/* Only render event block on its first hour */}
                        {event && (
                          <button
                            onClick={() => setSelectedTournamentDetail(event.tournament)}
                            className="absolute top-0 left-0 right-0 bg-gradient-to-br from-blue-400 to-green-400 border-2 border-blue-600 rounded px-2 py-1 text-xs font-bold text-white shadow-lg hover:shadow-xl transition cursor-pointer overflow-hidden"
                            style={{ height: '180px', width: 'calc(100% - 2px)' }}
                            title={`${event.tournament.name} - ${event.startTime} to ${event.endTime}`}
                          >
                            <div className="line-clamp-6 text-xs font-bold leading-tight break-words">
                              {event.tournament.name}
                            </div>
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
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
          <div className="bg-white rounded-xl border-4 border-blue-400 shadow-2xl w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header with close button */}
            <div className="flex items-start justify-between p-6 bg-gradient-to-r from-blue-100 to-cyan-100 border-b-4 border-blue-400 sticky top-0 z-10">
              <h2 className="text-3xl font-bold text-blue-900 flex-1">{selectedTournamentDetail.name}</h2>
              <button
                onClick={() => setSelectedTournamentDetail(null)}
                className="ml-4 p-3 bg-red-400 hover:bg-red-600 text-white rounded-lg transition font-bold flex-shrink-0"
                title="Close details"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Event type badges */}
              <div className="flex flex-wrap gap-3">
                {selectedTournamentDetail.eventNum && (
                  <span className="px-4 py-2 bg-yellow-200 text-yellow-900 rounded-lg font-bold border-2 border-yellow-400 text-base">
                    Event #{selectedTournamentDetail.eventNum}
                  </span>
                )}
                {selectedTournamentDetail.eventType === 'satellite' && (
                  <span className="px-4 py-2 bg-amber-300 text-amber-900 rounded-lg font-bold border-2 border-amber-400 text-base">
                    SAT
                  </span>
                )}
                {selectedTournamentDetail.eventType === 'side' && (
                  <span className="px-4 py-2 bg-teal-200 text-teal-900 rounded-lg font-bold border-2 border-teal-400 text-base">
                    SIDE
                  </span>
                )}
                <span className={`px-4 py-2 rounded-lg font-bold border-2 text-base ${getFormatBadgeColor(selectedTournamentDetail.format)}`}>
                  {getFormatLabel(selectedTournamentDetail.format)}
                </span>
              </div>

              {/* Date & Time */}
              <div className="bg-yellow-100 px-6 py-4 rounded-lg border-3 border-yellow-400 flex items-center gap-4">
                <Clock className="w-8 h-8 text-yellow-700 flex-shrink-0" />
                <div>
                  <p className="text-base text-yellow-700 font-bold">Start Time</p>
                  <p className="text-2xl font-black text-yellow-900">
                    {selectedTournamentDetail.flightDate || selectedTournamentDetail.startDates[0]} at{' '}
                    {selectedTournamentDetail.flightTime || selectedTournamentDetail.startTimes[0]}
                  </p>
                </div>
              </div>

              {/* Buy-in & Rake */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-green-100 px-6 py-4 rounded-lg border-3 border-green-400">
                  <p className="text-base text-green-700 font-bold mb-2">Buy-in</p>
                  <p className="text-3xl font-black text-green-900">{formatCurrency(selectedTournamentDetail.buyIn)}</p>
                </div>
                <div className="bg-cyan-100 px-6 py-4 rounded-lg border-3 border-cyan-400">
                  <p className="text-base text-cyan-700 font-bold mb-2">Rake</p>
                  <p className="text-3xl font-black text-cyan-900">{formatCurrency(selectedTournamentDetail.rakeFee)}</p>
                </div>
              </div>

              {/* Total Cost */}
              <div className="bg-red-100 px-6 py-4 rounded-lg border-3 border-red-400">
                <p className="text-base text-red-700 font-bold mb-2">Total Cost</p>
                <p className="text-3xl font-black text-red-900">
                  {formatCurrency(selectedTournamentDetail.buyIn + (selectedTournamentDetail.rakeFee || 0))}
                </p>
              </div>

              {/* Blind Structure */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-indigo-50 px-4 py-3 rounded-lg border-3 border-indigo-300">
                  <p className="text-base text-indigo-600 font-bold mb-2">Level Length</p>
                  <p className="text-2xl text-indigo-900 font-bold">{parseLevelLength(selectedTournamentDetail.blindLevels)}</p>
                </div>
                <div className="bg-orange-50 px-4 py-3 rounded-lg border-3 border-orange-300">
                  <p className="text-base text-orange-600 font-bold mb-2">Starting Blinds</p>
                  <p className="text-2xl text-orange-900 font-bold">{parseStartingBlinds(selectedTournamentDetail.blindLevels)}</p>
                </div>
                <div className="bg-emerald-50 px-4 py-3 rounded-lg border-3 border-emerald-300">
                  <p className="text-base text-emerald-600 font-bold mb-2">Starting Stack</p>
                  <p className="text-2xl text-emerald-900 font-bold">{formatStack(selectedTournamentDetail.startingStack)}</p>
                </div>
              </div>

              {/* Description */}
              {selectedTournamentDetail.description && (
                <div className="bg-gray-50 p-6 rounded-lg border-3 border-gray-300">
                  <p className="text-base text-gray-800 leading-relaxed font-medium">{selectedTournamentDetail.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
