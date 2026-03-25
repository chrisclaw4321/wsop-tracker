import React, { useMemo } from 'react';
import { Tournament, ScheduleEvent } from '../types';
import { Trash2, Euro } from 'lucide-react';

interface MyScheduleProps {
  selectedTournaments: Tournament[];
  onRemove: (tournamentId: number) => void;
}

export default function MySchedule({ selectedTournaments, onRemove }: MyScheduleProps) {
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

      {/* Gantt-style Schedule */}
      <div className="bg-white rounded-xl border-4 border-gray-300 shadow-xl p-8 overflow-x-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tournament Schedule (Gantt Chart)</h2>
        
        <div className="flex flex-col gap-1">
          {/* Day Headers */}
          <div className="flex gap-0">
            <div className="w-40 flex-shrink-0" /> {/* Space for time labels */}
            {allDays.map((day, idx) => {
              const formatted = formatDate(day);
              return (
                <div key={`header-${idx}`} className="flex-1 min-w-20 border border-gray-400 bg-gradient-to-b from-blue-200 to-blue-100 p-2 text-center font-bold text-sm">
                  <p className="text-gray-900">{formatted.day}</p>
                  <p className="text-lg font-black text-blue-700">{formatted.date}</p>
                  <p className="text-xs text-gray-700">{formatted.month}</p>
                </div>
              );
            })}
          </div>

          {/* Time rows (6 AM to midnight) */}
          {Array.from({ length: 19 }, (_, i) => i + 6).map((hour) => (
            <div key={`hour-${hour}`} className="flex gap-0 border-t border-gray-300">
              {/* Time label */}
              <div className="w-40 flex-shrink-0 bg-gray-100 border-r border-gray-400 px-3 py-2 font-bold text-sm text-gray-800 text-right">
                {minutesToTime(hour * 60)}
              </div>

              {/* Day columns */}
              {allDays.map((day) => {
                const dateStr = day.toISOString().split('T')[0];
                const dayEvents = scheduleEvents.filter(event => {
                  const startMin = timeToMinutes(event.startTime);
                  const endMin = timeToMinutes(event.endTime);
                  const hourMin = hour * 60;
                  const nextHourMin = (hour + 1) * 60;
                  
                  // Check if event overlaps with this hour
                  return event.startDate === dateStr && startMin < nextHourMin && endMin > hourMin;
                });

                return (
                  <div
                    key={`slot-${dateStr}-${hour}`}
                    className="flex-1 min-w-20 border border-gray-200 bg-white hover:bg-gray-50 p-1 relative group"
                    style={{ minHeight: '60px' }}
                  >
                    {dayEvents.map((event, idx) => {
                      const startMin = timeToMinutes(event.startTime);
                      const endMin = timeToMinutes(event.endTime);
                      const hourMin = hour * 60;
                      const nextHourMin = (hour + 1) * 60;
                      
                      // Calculate position and height
                      const topPercent = Math.max(0, (startMin - hourMin) / 60) * 100;
                      const heightPercent = Math.min(100, (Math.min(endMin, nextHourMin) - Math.max(startMin, hourMin)) / 60) * 100;

                      return (
                        <div
                          key={`${event.tournament.id}-${idx}`}
                          className="absolute bg-gradient-to-br from-blue-400 to-green-400 border-2 border-blue-600 rounded px-1 py-0.5 text-xs font-bold text-white shadow-md hover:shadow-lg transition w-full left-0 right-0"
                          style={{
                            top: `${topPercent}%`,
                            height: `${Math.max(10, heightPercent)}%`,
                            overflow: 'hidden'
                          }}
                          title={`${event.tournament.name} - ${event.startTime} to ${event.endTime}`}
                        >
                          <div className="line-clamp-2 text-xs font-bold">{event.tournament.name.substring(0, 12)}</div>
                          <button
                            onClick={() => onRemove(event.tournament.id)}
                            className="opacity-0 group-hover:opacity-100 absolute top-0.5 right-0.5 bg-red-500 hover:bg-red-700 text-white rounded p-0.5 transition text-xs"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
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
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm">{tournament.name}</p>
                  <div className="space-y-1 text-xs text-gray-700">
                    <p><strong>Date:</strong> {tournament.flightDate || tournament.startDates[0]}</p>
                    <p><strong>Time:</strong> {tournament.flightTime || tournament.startTimes[0]}</p>
                    <p className="flex items-center gap-1 font-bold text-blue-600">
                      <Euro className="w-3 h-3" />
                      €{tournament.buyIn}
                    </p>
                  </div>
                </div>
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
    </div>
  );
}
