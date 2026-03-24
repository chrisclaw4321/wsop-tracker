import React, { useState } from 'react';
import { Tournament } from '../types';
import { ChevronDown, Filter, Search } from 'lucide-react';

interface TournamentListProps {
  tournaments: Tournament[];
}

type FilterFormat = 'all' | 'nlh' | 'plo' | 'mixed' | 'bounty' | 'turbo' | 'highroller';
type SortBy = 'event' | 'buyIn' | 'date' | 'gtd';
type FilterType = 'all' | 'bracelet' | 'satellite' | 'side';

export default function TournamentList({ tournaments }: TournamentListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFormat, setFilterFormat] = useState<FilterFormat>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortBy>('event');

  const getEventType = (eventNum: string): FilterType => {
    if (eventNum.startsWith('SAT')) return 'satellite';
    if (eventNum.startsWith('SIDE')) return 'side';
    return 'bracelet';
  };

  const getFormatLabel = (format: string) => {
    if (format.includes('NLH')) return 'NLHE';
    if (format.includes('PLO')) return 'PLO';
    if (format.includes('Mixed')) return 'Mixed';
    return format;
  };

  const getFormatBadgeColor = (format: string) => {
    if (format.includes('NLH')) return 'bg-blue-600/30 text-blue-300';
    if (format.includes('PLO')) return 'bg-purple-600/30 text-purple-300';
    if (format.includes('Mixed')) return 'bg-green-600/30 text-green-300';
    if (format.includes('Bounty')) return 'bg-red-600/30 text-red-300';
    return 'bg-gray-600/30 text-gray-300';
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

  const filtered = tournaments.filter(t => {
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

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'buyIn':
        return a.buyIn - b.buyIn;
      case 'date':
        return new Date(a.startDates[0]).getTime() - new Date(b.startDates[0]).getTime();
      case 'gtd':
        return (b.gtd || 0) - (a.gtd || 0);
      case 'event':
      default:
        return parseInt(a.eventNum) - parseInt(b.eventNum);
    }
  });

  const formatCurrency = (amount: number) => {
    return `€${amount.toLocaleString()}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + ' 2026');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tournaments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/60"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="w-4 h-4 text-gray-400" />
          
          {/* Event Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="px-3 py-2 bg-blue-600/20 border border-blue-500/30 rounded text-sm text-blue-200 focus:outline-none focus:border-blue-500/60"
          >
            <option value="all">All Events ({tournaments.length})</option>
            <option value="bracelet">Bracelet Events (15)</option>
            <option value="satellite">Satellites (3)</option>
            <option value="side">Side Events (10)</option>
          </select>

          {/* Format Filter */}
          <select
            value={filterFormat}
            onChange={(e) => setFilterFormat(e.target.value as FilterFormat)}
            className="px-3 py-2 bg-purple-600/20 border border-purple-500/30 rounded text-sm text-purple-200 focus:outline-none focus:border-purple-500/60"
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
            className="px-3 py-2 bg-purple-600/20 border border-purple-500/30 rounded text-sm text-purple-200 focus:outline-none focus:border-purple-500/60 ml-auto"
          >
            <option value="event">Event #</option>
            <option value="buyIn">Buy-in (Low to High)</option>
            <option value="date">Start Date</option>
            <option value="gtd">Guarantee (High to Low)</option>
          </select>
        </div>

        <p className="text-sm text-gray-400">
          Showing {sorted.length} of {tournaments.length} tournaments
        </p>
      </div>

      {/* Tournament List */}
      <div className="space-y-2">
        {sorted.map((tournament) => (
          <div
            key={tournament.id}
            className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-lg overflow-hidden transition hover:border-purple-500/40 hover:from-purple-900/30 hover:to-blue-900/30"
          >
            {/* Main Row - Compact view */}
            <button
              onClick={() => setExpandedId(expandedId === tournament.id ? null : tournament.id)}
              className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition"
            >
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-base font-bold text-yellow-400 min-w-[50px]">#{tournament.eventNum}</span>
                  <h3 className="text-base font-semibold text-white truncate flex-1">
                    {tournament.name}
                  </h3>
                  <span className={`px-2 py-1 rounded text-sm font-medium whitespace-nowrap ${getFormatBadgeColor(tournament.format)}`}>
                    {getFormatLabel(tournament.format)}
                  </span>
                </div>

                {/* Quick Info - 2 lines max */}
                <div className="grid grid-cols-4 gap-2 text-sm text-gray-300">
                  <div>
                    <span className="text-gray-500">Buy-in:</span> {formatCurrency(tournament.buyIn)}
                  </div>
                  <div>
                    <span className="text-gray-500">+Rake:</span> {formatCurrency(tournament.rakeFee)}
                  </div>
                  <div>
                    <span className="text-gray-500">Starts:</span> {formatDate(tournament.startDates[0])}
                  </div>
                  {tournament.gtd && (
                    <div>
                      <span className="text-gray-500">GTD:</span> <span className="text-green-400">{formatCurrency(tournament.gtd)}</span>
                    </div>
                  )}
                </div>
              </div>

              <ChevronDown
                className={`w-5 h-5 text-purple-400 transition transform ml-2 flex-shrink-0 ${
                  expandedId === tournament.id ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Expanded Details */}
            {expandedId === tournament.id && (
              <div className="px-4 py-3 bg-white/5 border-t border-purple-500/20 space-y-3 text-base">
                {/* Flights & Times */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-gray-400">Flights:</span>
                    <p className="text-white font-semibold">{tournament.flights} flight{tournament.flights !== 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Start Times:</span>
                    <p className="text-white font-semibold">{tournament.startTimes.join(', ')}</p>
                  </div>
                </div>

                {/* Structure Details */}
                {(tournament.startingStack || tournament.blindLevels) && (
                  <div className="grid grid-cols-2 gap-3 bg-white/5 p-2 rounded">
                    {tournament.startingStack && (
                      <div>
                        <span className="text-gray-400">Starting Stack:</span>
                        <p className="text-white font-semibold">{tournament.startingStack.toLocaleString()} chips</p>
                      </div>
                    )}
                    {tournament.blindLevels && (
                      <div>
                        <span className="text-gray-400">Blind Levels:</span>
                        <p className="text-white font-semibold">{tournament.blindLevels}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Special Features */}
                <div className="flex flex-wrap gap-2">
                  {tournament.isBounty && (
                    <span className="px-2 py-1 bg-red-600/30 text-red-300 rounded text-xs font-medium">
                      🎯 Bounty Event
                    </span>
                  )}
                  {tournament.isTurbo && (
                    <span className="px-2 py-1 bg-orange-600/30 text-orange-300 rounded text-xs font-medium">
                      ⚡ Turbo Format
                    </span>
                  )}
                  {tournament.isMultiday && (
                    <span className="px-2 py-1 bg-blue-600/30 text-blue-300 rounded text-xs font-medium">
                      📅 Multi-Day
                    </span>
                  )}
                  {tournament.eventNum === '5' && (
                    <span className="px-2 py-1 bg-yellow-600/30 text-yellow-300 rounded text-xs font-medium">
                      👑 Main Event - €10M GTD
                    </span>
                  )}
                </div>

                {/* Total Cost */}
                <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-2 rounded border border-green-500/30">
                  <span className="text-gray-300">Total Cost (Buy-in + Rake):</span>
                  <p className="text-lg font-bold text-green-300">{formatCurrency(tournament.buyIn + tournament.rakeFee)}</p>
                </div>

                {/* Description */}
                {tournament.description && (
                  <p className="text-gray-300 text-xs leading-relaxed pt-1">
                    {tournament.description}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
