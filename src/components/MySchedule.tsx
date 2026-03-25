import React, { useMemo } from 'react';
import { Tournament, ScheduleEvent } from '../types';
import { ChevronLeft, ChevronRight, Trash2, Clock, Euro } from 'lucide-react';

interface MyScheduleProps {
  selectedTournaments: Tournament[];
  onRemove: (tournamentId: number) => void;
}

export default function MySchedule({ selectedTournaments, onRemove }: MyScheduleProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date(2026, 2, 31)); // March 31, 2026

  // Convert time string "12:00 PM" to minutes since midnight
  const timeToMinutes = (timeStr: string): number => {
    const parts = timeStr.split(/[\s:]/);
    let hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    const isPM = timeStr.toLowerCase().includes('pm');
    
    if (isPM && hours !== 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
  };

  // Parse date string "2026-03-31" or "Mar 31"
  const parseDate = (dateStr: string): Date => {
    if (dateStr.includes('-')) {
      // ISO format
      const parts = dateStr.split('-');
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    // Display format "Mar 31" - use current year assumption
    const months: Record<string, number> = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    const parts = dateStr.split(' ');
    const month = months[parts[0]] || 2;
    const day = parseInt(parts[1]) || 1;
    return new Date(2026, month, day);
  };

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

  // Group events by date for calendar view
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, ScheduleEvent[]> = {};
    scheduleEvents.forEach(event => {
      if (!grouped[event.startDate]) {
        grouped[event.startDate] = [];
      }
      grouped[event.startDate].push(event);
    });
    
    // Sort by time within each date
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => {
        const aMin = timeToMinutes(a.startTime);
        const bMin = timeToMinutes(b.startTime);
        return aMin - bMin;
      });
    });
    
    return grouped;
  }, [scheduleEvents]);

  // Calculate summary
  const summary = useMemo(() => {
    const totalBuyIn = selectedTournaments.reduce((sum, t) => sum + t.buyIn, 0);
    const totalEvents = selectedTournaments.length;
    return { totalBuyIn, totalEvents };
  }, [selectedTournaments]);

  const formatDate = (dateStr: string) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      const month = months[parseInt(parts[1]) - 1];
      const day = parseInt(parts[2]);
      return `${month} ${day}`;
    }
    return dateStr;
  };

  const navigateDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  if (selectedTournaments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">My Schedule</h1>
          <div className="bg-white rounded-xl border-4 border-gray-300 p-12 text-center shadow-lg">
            <p className="text-2xl text-gray-600 font-semibold mb-4">No tournaments selected yet</p>
            <p className="text-lg text-gray-500">Go back to the tournament list and select tournaments to build your schedule.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-blue-900 mb-8">My Tournament Schedule</h1>

        {/* Summary Box */}
        <div className="grid grid-cols-3 gap-6 mb-10">
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

        {/* Calendar View */}
        <div className="bg-white rounded-xl border-4 border-gray-300 shadow-xl p-8">
          {/* Date Navigation */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Calendar</h2>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-700">
                March 31 - April 12, 2026
              </p>
            </div>
            <div className="w-20" /> {/* Spacer for alignment */}
          </div>

          {/* Events Grid by Date */}
          <div className="space-y-6">
            {Object.keys(eventsByDate)
              .sort()
              .map(dateStr => (
                <div key={dateStr} className="border-t-4 border-gray-300 pt-6 first:border-t-0 first:pt-0">
                  <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-4">
                      {formatDate(dateStr)}
                    </span>
                  </h3>

                  <div className="space-y-3 ml-4">
                    {eventsByDate[dateStr].map((event, idx) => (
                      <div
                        key={`${event.tournament.id}-${idx}`}
                        className="bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-500 p-4 rounded-lg flex items-center justify-between hover:shadow-md transition"
                      >
                        <div className="flex-1">
                          <p className="font-bold text-lg text-blue-900">
                            {event.tournament.name}
                          </p>
                          <div className="flex items-center gap-6 mt-2 text-sm text-gray-700">
                            <span className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {event.startTime} - {event.endTime}
                            </span>
                            <span className="flex items-center gap-2">
                              <Euro className="w-4 h-4" />
                              €{event.tournament.buyIn}
                            </span>
                            <span className="bg-gray-200 px-3 py-1 rounded-full text-xs font-bold">
                              {event.durationHours}h
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemove(event.tournament.id)}
                          className="ml-4 p-2 bg-red-200 hover:bg-red-400 text-red-900 rounded-lg transition font-bold"
                          title="Remove from schedule"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Selected Events List */}
        <div className="mt-12 bg-white rounded-xl border-4 border-gray-300 shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Selected Events ({selectedTournaments.length})</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {selectedTournaments.map((tournament, idx) => (
              <div key={tournament.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="font-semibold text-gray-800">
                  {idx + 1}. {tournament.name}
                </span>
                <span className="text-blue-600 font-bold">€{tournament.buyIn}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
