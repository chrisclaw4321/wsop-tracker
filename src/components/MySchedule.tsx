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

  // Parse date string "2026-03-31" or "Mar 31" - returns ISO string for consistent matching
  const parseDate = (dateStr: string): string => {
    if (dateStr.includes('-')) {
      // Already in ISO format
      return dateStr;
    }
    const months: Record<string, string> = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
      'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    const parts = dateStr.split(' ');
    const month = months[parts[0]] || '03';
    const day = parseInt(parts[1]) || 1;
    return `2026-${month}-${day.toString().padStart(2, '0')}`;
  };

  // Create schedule events
  const scheduleEvents: ScheduleEvent[] = useMemo(() => {
    const events = selectedTournaments.map(tournament => {
      const startDateStr = tournament.flightDate || tournament.startDates[0];
      const startTimeStr = tournament.flightTime || tournament.startTimes[0];
      
      // IMPORTANT: Parse to ISO format for consistent matching in getEventForSlot
      const startDate = parseDate(startDateStr);  // Returns ISO string like "2026-04-05"
      const startMinutes = timeToMinutes(startTimeStr);
      
      // Calculate end time (6 hours = 360 minutes)
      const endMinutes = startMinutes + 360;
      
      // Calculate end date using UTC
      const endDateObj = new Date(startDate + 'T00:00:00Z');
      if (endMinutes >= 24 * 60) {
        endDateObj.setUTCDate(endDateObj.getUTCDate() + 1);
      }
      
      const endYear = endDateObj.getUTCFullYear();
      const endMonth = String(endDateObj.getUTCMonth() + 1).padStart(2, '0');
      const endDay = String(endDateObj.getUTCDate()).padStart(2, '0');
      const endDateIso = `${endYear}-${endMonth}-${endDay}`;
      
      const endHours = Math.floor((endMinutes % (24 * 60)) / 60);
      const endMins = endMinutes % 60;
      const endTimeStr = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
      
      return {
        tournament,
        startDate: startDate,  // ISO string "2026-04-05"
        startTime: startTimeStr,
        endDate: endDateIso,  // ISO string
        endTime: endTimeStr,
        durationHours: 6
      };
    });
    
    // Debug log
    console.log(`[Calendar] Schedule events created (${events.length} total):`, 
      events.map(e => `${e.tournament.name} on ${e.startDate} @ ${e.startTime}`)
    );
    
    return events;
  }, [selectedTournaments]);

  // Generate array of all days from Mar 31 to Apr 12, 2026 (as ISO strings to avoid timezone issues)
  const allDays = useMemo(() => {
    const days: string[] = [];
    // Use UTC dates to avoid timezone conversion issues
    const start = new Date('2026-03-31T00:00:00Z');
    const end = new Date('2026-04-12T00:00:00Z');
    
    let current = new Date(start);
    while (current <= end) {
      // Get UTC date components
      const year = current.getUTCFullYear();
      const month = String(current.getUTCMonth() + 1).padStart(2, '0');
      const day = String(current.getUTCDate()).padStart(2, '0');
      days.push(`${year}-${month}-${day}`);
      
      current.setUTCDate(current.getUTCDate() + 1);
    }
    return days;
  }, []);

  // Calculate summary
  const summary = useMemo(() => {
    const totalBuyIn = selectedTournaments.reduce((sum, t) => sum + t.buyIn, 0);
    const totalEvents = selectedTournaments.length;
    return { totalBuyIn, totalEvents };
  }, [selectedTournaments]);

  const formatDate = (dateStr: string) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // Parse as UTC to avoid timezone issues
    const date = new Date(dateStr + 'T00:00:00Z');
    return {
      day: dayNames[date.getUTCDay()],
      date: date.getUTCDate(),
      month: months[date.getUTCMonth()],
      fullDate: dateStr
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
    const match = scheduleEvents.find(event => {
      const dateMatch = event.startDate === dateStr;
      if (!dateMatch) return false;
      
      const eventStartHour = Math.floor(timeToMinutes(event.startTime) / 60);
      const eventEndHour = Math.floor(timeToMinutes(event.endTime) / 60);
      // Use <= to include the final hour (e.g., hour 24 for events ending at midnight)
      const timeMatch = hour >= eventStartHour && hour <= eventEndHour;
      
      if (dateMatch && timeMatch) {
        console.log(`[Calendar] Found event match: ${event.tournament.name} on ${dateStr} hour ${hour}`);
      }
      return timeMatch;
    }) || null;
    
    // Debug: Log all events on first call for this date
    if (hour === 6 && !sessionStorage.getItem(`logged_${dateStr}`)) {
      sessionStorage.setItem(`logged_${dateStr}`, 'true');
      const eventsOnDate = scheduleEvents.filter(e => e.startDate === dateStr);
      if (eventsOnDate.length > 0) {
        console.log(`[Calendar] Events on ${dateStr}:`, eventsOnDate.map(e => `${e.tournament.name} @ ${e.startTime}`));
      }
    }
    
    return match;
  };

  // Check if this is the first hour of an event (to avoid duplicate blocks)
  const isFirstHourOfEvent = (dateStr: string, hour: number, event: ScheduleEvent): boolean => {
    const eventStartHour = Math.floor(timeToMinutes(event.startTime) / 60);
    return hour === eventStartHour;
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
              {allDays.map((dateStr, idx) => {
                const formatted = formatDate(dateStr);
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
            {Array.from({ length: 19 }, (_, i) => i + 6).map((hour) => (
              <tr key={`hour-${hour}`} style={{ height: '30px' }}>
                {/* Time label */}
                <td className="border-2 border-gray-400 bg-gray-100 p-1 font-bold text-center text-gray-800 w-24">
                  {minutesToTime(hour * 60)}
                </td>

                {/* Day cells */}
                {allDays.map((dateStr) => {
                  const event = getEventForSlot(dateStr, hour);
                  const isFirstHour = event ? isFirstHourOfEvent(dateStr, hour, event) : false;

                  return (
                    <td key={`cell-${dateStr}-${hour}`} className="border-2 border-gray-300 p-1 bg-white hover:bg-gray-50 relative w-32">
                      {/* Only render event block on its first hour */}
                      {isFirstHour && event && (
                        <button
                          onClick={() => setSelectedTournamentDetail(event.tournament)}
                          className="absolute inset-0 bg-gradient-to-br from-blue-400 to-green-400 border-2 border-blue-600 rounded-md px-2 py-1 text-xs font-bold text-white shadow-lg hover:shadow-xl transition cursor-pointer z-10 overflow-hidden"
                          style={{ height: '180px' }} // 6 hours * 30px
                          title={`${event.tournament.name} - ${event.startTime} to ${event.endTime}`}
                        >
                          <div className="line-clamp-4 text-xs font-bold leading-tight break-words">
                            {event.tournament.name}
                          </div>
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
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
          <div className="bg-white rounded-xl border-4 border-blue-400 shadow-2xl w-11/12 max-w-4xl">
            {/* Header with close button */}
            <div className="flex items-start justify-between p-6 bg-gradient-to-r from-blue-100 to-cyan-100 border-b-4 border-blue-400">
              <h2 className="text-3xl font-bold text-blue-900 flex-1">{selectedTournamentDetail.name}</h2>
              <button
                onClick={() => setSelectedTournamentDetail(null)}
                className="ml-4 p-3 bg-red-400 hover:bg-red-600 text-white rounded-lg transition font-bold flex-shrink-0"
                title="Close details"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Content - Grid layout for all info visible at once */}
            <div className="p-8 space-y-6">
              {/* Event type badges - Row 1 */}
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

              {/* Date & Time - Row 2 */}
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

              {/* Buy-in & Rake - Row 3 */}
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

              {/* Total Cost - Row 4 */}
              <div className="bg-red-100 px-6 py-4 rounded-lg border-3 border-red-400">
                <p className="text-base text-red-700 font-bold mb-2">Total Cost</p>
                <p className="text-3xl font-black text-red-900">
                  {formatCurrency(selectedTournamentDetail.buyIn + (selectedTournamentDetail.rakeFee || 0))}
                </p>
              </div>

              {/* Blind Structure - Row 5 */}
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

              {/* Description - Row 6 */}
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
