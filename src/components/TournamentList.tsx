import React, { useState, useMemo } from 'react';
import { Tournament } from '../types';
import { ChevronDown, Filter, Search } from 'lucide-react';

interface TournamentListProps {
  tournaments: Tournament[];
}

type FilterFormat = 'all' | 'nlh' | 'plo' | 'mixed' | 'bounty' | 'turbo' | 'highroller';
type SortBy = 'startTime' | 'buyIn' | 'event' | 'gtd';
type FilterType = 'all' | 'bracelet' | 'satellite' | 'side';

export default function TournamentList({ tournaments }: TournamentListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFormat, setFilterFormat] = useState<FilterFormat>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortBy>('startTime');

  const getEventType = (eventNum: string): FilterType => {
    if (eventNum.startsWith('SAT')) return 'satellite';
    if (eventNum.startsWith('SIDE')) return 'side';
    return 'bracelet';
  };

  // Extract clean event number (remove "Flight X" suffix)
  const getCleanEventNum = (eventNum: string): string => {
    return eventNum.replace(/\s*-\s*Flight\s*\d+\s*$/i, '').trim();
  };

  // Count flights for an event
  const getFlightCount = (eventNum: string, allTournaments: Tournament[]): number => {
    const cleanNum = getCleanEventNum(eventNum);
    return allTournaments.filter(t => getCleanEventNum(t.eventNum) === cleanNum).length;
  };

  const getFormatLabel = (format: string) => {
    if (format.includes('NLH')) return 'NLHE';
    if (format.includes('PLO')) return 'PLO';
    if (format.includes('Mixed')) return 'Mixed';
    return format;
  };

  // Bright color scheme
  const getFormatBadgeColor = (format: string) => {
    if (format.includes('NLH')) return 'bg-blue-200 text-blue-900 border-blue-400 border-2';
    if (format.includes('PLO')) return 'bg-purple-200 text-purple-900 border-purple-400 border-2';
    if (format.includes('Mixed')) return 'bg-green-200 text-green-900 border-green-400 border-2';
    if (format.includes('Bounty')) return 'bg-red-200 text-red-900 border-red-400 border-2';
    return 'bg-yellow-200 text-yellow-900 border-yellow-400 border-2';
  };

  // Parse blindLevels string like "20-minute, starting at 25/50" into components
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
    return stack.toLocaleString();
  };

  const getFormatFilter = (format: string): FilterFormat => {
    if (format.includes('High Roller') || format.includes('Super High Roller')) return 'highroller';
    if (format.includes('Bounty')) return 'bounty';
    if (format.includes('Turbo')) return 'turbo';
    if (format.includes('PLO')) return 'plo';
    if (format.includes('Mixed')) return 'mixed';
    if (format.includes('NLH')) return 'nlh';
    return 'all';
  };

  // Parse date string to get comparable value (handles "Mar 31", "Apr 1", etc)
  const parseDateForComparison = (dateStr: string, timeStr: string): number => {
    const monthMap: Record<string, number> = {
      'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
      'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };
    
    const parts = dateStr.split(' ');
    const month = monthMap[parts[0]] || 3; // default March
    const day = parseInt(parts[1]) || 0;
    
    // Parse time (e.g., "12:00 PM")
    const timeParts = timeStr.split(/[\s:]/);
    let hour = parseInt(timeParts[0]) || 0;
    const minute = parseInt(timeParts[1]) || 0;
    const isPM = timeStr.toLowerCase().includes('pm');
    
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    
    // Create sortable number: MMDDHHMM
    return month * 1000000 + day * 10000 + hour * 100 + minute;
  };

  const filtered = useMemo(() => {
    return tournaments.filter(t => {
      const matchesSearch = 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.eventNum.includes(searchTerm) ||
        t.format.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesType = true;
      if (filterType !== 'all') {
        matchesType = getEventType(t.eventNum) === filterType;
      }
      
      let matchesFormat = true;
      if (filterFormat !== 'all') {
        matchesFormat = getFormatFilter(t.format) === filterFormat;
      }
      
      return matchesSearch && matchesType && matchesFormat;
    });
  }, [searchTerm, filterType, filterFormat, tournaments]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'buyIn':
          return a.buyIn - b.buyIn;
        case 'gtd':
          return (b.gtd || 0) - (a.gtd || 0);
        case 'event':
          return parseInt(a.eventNum.replace(/\D/g, '') || '0') - parseInt(b.eventNum.replace(/\D/g, '') || '0');
        case 'startTime':
        default: {
          // Sort by actual start time across all tournaments
          const aDate = a.flightDate || a.startDates[0];
          const aTime = a.flightTime || a.startTimes[0];
          const bDate = b.flightDate || b.startDates[0];
          const bTime = b.flightTime || b.startTimes[0];
          
          const aSort = parseDateForComparison(aDate, aTime);
          const bSort = parseDateForComparison(bDate, bTime);
          return aSort - bSort;
        }
      }
    });
  }, [filtered, sortBy]);

  const formatCurrency = (amount: number) => {
    return `€${amount.toLocaleString()}`;
  };

  const formatDate = (dateStr: string) => {
    // Handles "Mar 31" format
    return dateStr;
  };

  const formatDateTime = (dateStr: string, timeStr: string) => {
    return `${dateStr} ${timeStr}`;
  };

  return (
    <div className="space-y-8">
      {/* Search and Filter Bar */}
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-7 h-7 text-blue-600" />
          <input
            type="text"
            placeholder="Search tournaments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border-4 border-blue-400 rounded-lg text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300 shadow-md font-semibold"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-lg border-3 border-blue-300 shadow-md">
          <Filter className="w-6 h-6 text-blue-700 font-bold" />
          
          {/* Event Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="px-4 py-2 bg-white border-3 border-blue-400 rounded-lg text-base font-bold text-blue-900 focus:outline-none focus:border-green-500 shadow-md cursor-pointer"
          >
            <option value="all">All Events ({tournaments.length})</option>
            <option value="bracelet">Bracelet Events (15)</option>
            <option value="satellite">Satellites (11)</option>
            <option value="side">Side Events (10)</option>
          </select>

          {/* Format Filter */}
          <select
            value={filterFormat}
            onChange={(e) => setFilterFormat(e.target.value as FilterFormat)}
            className="px-4 py-2 bg-white border-3 border-purple-400 rounded-lg text-base font-bold text-purple-900 focus:outline-none focus:border-green-500 shadow-md cursor-pointer"
          >
            <option value="all">All Formats</option>
            <option value="nlh">No-Limit Hold'em</option>
            <option value="plo">PLO</option>
            <option value="mixed">Mixed Games</option>
            <option value="bounty">Bounty Events</option>
            <option value="turbo">Turbo Events</option>
            <option value="highroller">High Rollers</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-4 py-2 bg-white border-3 border-green-400 rounded-lg text-base font-bold text-green-900 focus:outline-none focus:border-green-500 shadow-md cursor-pointer ml-auto"
          >
            <option value="startTime">⏰ Start Time (Chronological)</option>
            <option value="buyIn">💰 Buy-in (Low to High)</option>
            <option value="event">🎪 Event #</option>
            <option value="gtd">🏆 Guarantee (High to Low)</option>
          </select>
        </div>

        <p className="text-base text-gray-800 font-bold bg-yellow-100 p-4 rounded-lg border-3 border-yellow-400 shadow-md">
          Showing {sorted.length} of {tournaments.length} tournaments
        </p>
      </div>

      {/* Tournament List */}
      <div className="space-y-4">
        {sorted.map((tournament) => (
          <div
            key={tournament.id}
            className="bg-gradient-to-r from-white to-blue-50 border-4 border-blue-300 rounded-lg overflow-hidden transition hover:border-green-400 hover:shadow-xl hover:from-blue-50 hover:to-cyan-50 shadow-md"
          >
            {/* Main Row - Compact view */}
            <button
              onClick={() => setExpandedId(expandedId === tournament.id ? null : tournament.id)}
              className="w-full p-5 flex items-center justify-between hover:bg-blue-50 transition"
            >
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-4 mb-3 flex-wrap">
                  <span className="text-3xl font-bold text-yellow-600 min-w-fit drop-shadow">#{getCleanEventNum(tournament.eventNum)}</span>
                  <h3 className="text-xl font-bold text-blue-900 truncate flex-1 drop-shadow-sm">
                    {tournament.name}
                  </h3>
                  <span className={`px-4 py-2 rounded-lg text-base font-bold whitespace-nowrap shadow-md ${getFormatBadgeColor(tournament.format)}`}>
                    {getFormatLabel(tournament.format)}
                  </span>
                  {getFlightCount(tournament.eventNum, tournaments) > 1 && (
                    <span className="px-3 py-2 bg-indigo-200 text-indigo-900 rounded-lg text-base font-bold border-2 border-indigo-400 shadow-md whitespace-nowrap">
                      ✈️ {getFlightCount(tournament.eventNum, tournaments)} Flights
                    </span>
                  )}
                </div>

                {/* Buy-in Info Row */}
                <div className="grid grid-cols-4 gap-3 text-base font-bold text-gray-900 mb-2">
                  <div className="bg-green-100 px-3 py-2 rounded-lg border-2 border-green-400 shadow-sm">
                    <span className="text-sm text-green-700">💰 Buy-in:</span>
                    <p className="text-base text-green-900">{formatCurrency(tournament.buyIn)}</p>
                  </div>
                  <div className="bg-cyan-100 px-3 py-2 rounded-lg border-2 border-cyan-400 shadow-sm">
                    <span className="text-sm text-cyan-700">+ Rake:</span>
                    <p className="text-base text-cyan-900">{formatCurrency(tournament.rakeFee)}</p>
                  </div>
                  <div className="bg-red-100 px-3 py-2 rounded-lg border-2 border-red-400 shadow-sm">
                    <span className="text-sm text-red-700">= Total:</span>
                    <p className="text-lg font-black text-red-900">{formatCurrency(tournament.buyIn + tournament.rakeFee)}</p>
                  </div>
                  {tournament.gtd && (
                    <div className="bg-purple-100 px-3 py-2 rounded-lg border-2 border-purple-400 shadow-sm">
                      <span className="text-sm text-purple-700">🏆 GTD:</span>
                      <p className="text-base text-purple-900">{formatCurrency(tournament.gtd)}</p>
                    </div>
                  )}
                </div>

                {/* Tournament Structure - 3 Standard Boxes: Level Length, Starting Blinds, Starting Stack */}
                <div className="grid grid-cols-3 gap-3 text-base font-bold text-gray-900 mb-2">
                  <div className="bg-indigo-50 px-3 py-2 rounded-lg border-2 border-indigo-300 shadow-sm">
                    <span className="text-sm text-indigo-600">⏱️ Level:</span>
                    <p className="text-base text-indigo-900">{parseLevelLength(tournament.blindLevels)}</p>
                  </div>
                  <div className="bg-orange-50 px-3 py-2 rounded-lg border-2 border-orange-300 shadow-sm">
                    <span className="text-sm text-orange-600">🎰 Blinds:</span>
                    <p className="text-base text-orange-900">{parseStartingBlinds(tournament.blindLevels)}</p>
                  </div>
                  <div className="bg-emerald-50 px-3 py-2 rounded-lg border-2 border-emerald-300 shadow-sm">
                    <span className="text-sm text-emerald-600">💎 Stack:</span>
                    <p className="text-base text-emerald-900">{formatStack(tournament.startingStack)}</p>
                  </div>
                </div>
              </div>

              <ChevronDown
                className={`w-8 h-8 text-blue-600 transition transform ml-3 flex-shrink-0 font-bold drop-shadow ${
                  expandedId === tournament.id ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Expanded Details */}
            {expandedId === tournament.id && (
              <div className="px-6 py-5 bg-gradient-to-b from-blue-50 to-cyan-50 border-t-4 border-blue-300 space-y-5 text-base">
                {/* Special Features */}
                <div className="flex flex-wrap gap-3">
                  {tournament.isBounty && (
                    <span className="px-4 py-3 bg-red-200 text-red-900 rounded-lg text-base font-bold border-2 border-red-400 shadow-md">
                      🎯 Bounty Event
                    </span>
                  )}
                  {tournament.isTurbo && (
                    <span className="px-4 py-3 bg-orange-200 text-orange-900 rounded-lg text-base font-bold border-2 border-orange-400 shadow-md">
                      ⚡ Turbo Format
                    </span>
                  )}
                  {tournament.isMultiday && (
                    <span className="px-4 py-3 bg-blue-200 text-blue-900 rounded-lg text-base font-bold border-2 border-blue-400 shadow-md">
                      📅 Multi-Day
                    </span>
                  )}
                  {tournament.eventNum === '5' && (
                    <span className="px-4 py-3 bg-yellow-200 text-yellow-900 rounded-lg text-base font-bold border-2 border-yellow-400 shadow-md">
                      👑 Main Event - €10M GTD
                    </span>
                  )}
                </div>

                {/* Description */}
                {tournament.description && (
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-300 shadow-md">
                    <p className="text-gray-800 text-base leading-relaxed">
                      {tournament.description}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
