import React, { useState } from 'react';
import { Tournament } from '../types';
import TournamentCard from './TournamentCard';
import { Filter, SortAsc } from 'lucide-react';

interface Props {
  tournaments: Tournament[];
}

type SortBy = 'date' | 'buyIn' | 'prize' | 'name';
type FilterBy = 'all' | 'low' | 'medium' | 'high';

export default function TournamentList({ tournaments }: Props) {
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [filterBy, setFilterBy] = useState<FilterBy>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = tournaments.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filterBy === 'all' ? true :
      filterBy === 'low' ? t.buyIn < 2000 :
      filterBy === 'medium' ? t.buyIn >= 2000 && t.buyIn < 5000 :
      filterBy === 'high' ? t.buyIn >= 5000 : true;
    
    return matchesSearch && matchesFilter;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      case 'buyIn':
        return a.buyIn - b.buyIn;
      case 'prize':
        return b.guaranteedPrizepool - a.guaranteedPrizepool;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div>
      {/* Filters and Controls */}
      <div className="bg-white/5 backdrop-blur-md rounded-lg border border-purple-500/20 p-6 mb-8">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search tournaments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Filter */}
          <div>
            <label className="flex items-center space-x-2 text-gray-300 mb-3">
              <Filter className="w-4 h-4" />
              <span>Filter by Buy-In</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all' as FilterBy, label: 'All' },
                { value: 'low' as FilterBy, label: 'Under €2K' },
                { value: 'medium' as FilterBy, label: '€2K-€5K' },
                { value: 'high' as FilterBy, label: 'Over €5K' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setFilterBy(option.value)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    filterBy === option.value
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="flex items-center space-x-2 text-gray-300 mb-3">
              <SortAsc className="w-4 h-4" />
              <span>Sort by</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="w-full px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="date">Start Date</option>
              <option value="buyIn">Buy-In (Low to High)</option>
              <option value="prize">Prize Pool (High to Low)</option>
              <option value="name">Tournament Name</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-400">
          Showing {sorted.length} of {tournaments.length} tournaments
        </div>
      </div>

      {/* Tournament Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map(tournament => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No tournaments match your criteria</p>
        </div>
      )}
    </div>
  );
}
