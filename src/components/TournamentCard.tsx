import React, { useState } from 'react';
import { Tournament } from '../types';
import { Calendar, Users, Zap, Award, MapPin, Info, Clock } from 'lucide-react';

interface Props {
  tournament: Tournament;
}

export default function TournamentCard({ tournament }: Props) {
  const [expanded, setExpanded] = useState(false);
  const startDate = new Date(tournament.startDate);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: '2-digit'
  });

  const formattedPrizepool = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    notation: 'compact',
    maximumFractionDigits: 0
  }).format(tournament.guaranteedPrizepool);

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md rounded-lg border border-purple-500/30 overflow-hidden hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-purple-100 text-sm font-semibold">Event #{tournament.number}</p>
            <h3 className="text-2xl font-bold text-white">{tournament.name}</h3>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-yellow-300">{tournament.buyIn}</p>
            <p className="text-sm text-purple-100">{tournament.currency}</p>
          </div>
        </div>
        <p className="text-purple-100 text-sm">{tournament.description}</p>
      </div>

      {/* Main Info */}
      <div className="px-6 py-4 space-y-3">
        {/* Date */}
        <div className="flex items-center space-x-3 text-gray-300">
          <Calendar className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <span className="text-sm">{formattedDate}</span>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-3 text-gray-300">
          <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <span className="text-sm">{tournament.location}</span>
        </div>

        {/* Prize Pool */}
        <div className="flex items-center space-x-3 text-gray-300">
          <Award className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-semibold text-yellow-300">{formattedPrizepool}</span>
            <span className="text-gray-400"> GTD</span>
          </div>
        </div>

        {/* Max Players */}
        <div className="flex items-center space-x-3 text-gray-300">
          <Users className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <span className="text-sm">Max {tournament.maxPlayers.toLocaleString()} players</span>
        </div>

        {/* Bracket Type */}
        <div className="flex items-center space-x-3 text-gray-300">
          <Zap className="w-5 h-5 text-orange-400 flex-shrink-0" />
          <span className="text-sm">{tournament.bracketType}</span>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-6 py-4 bg-black/20 border-t border-purple-500/20 space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Buy-In Range</p>
              <p className="text-white font-semibold">{tournament.currency}{tournament.buyIn}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Format</p>
              <p className="text-white font-semibold">{tournament.bracketType}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Expected Players</p>
              <p className="text-white font-semibold">Up to {tournament.maxPlayers.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Guaranteed</p>
              <p className="text-yellow-400 font-semibold">{formattedPrizepool}</p>
            </div>
          </div>
          
          {/* Continuation Days */}
          {tournament.continuationDays && tournament.continuationDays.length > 0 && (
            <div className="pt-3 border-t border-purple-500/20">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-2 flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Continuation Days</span>
              </p>
              <div className="space-y-1">
                {tournament.continuationDays.map((cd) => {
                  const cdDate = new Date(cd.date + 'T12:00:00');
                  return (
                    <div key={cd.day} className="flex justify-between text-xs">
                      <span className="text-purple-300 font-medium">Day {cd.day}</span>
                      <span className="text-gray-300">
                        {cdDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} @ {cd.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-purple-500/20">
            <p className="text-gray-300 text-xs">
              <span className="font-semibold">Location:</span> {tournament.location}
            </p>
            <p className="text-gray-300 text-xs mt-2">
              <span className="font-semibold">Start Date:</span> {startDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-3 border-t border-purple-500/20 flex justify-between items-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 text-sm transition"
        >
          <Info className="w-4 h-4" />
          <span>{expanded ? 'Hide Details' : 'View Details'}</span>
        </button>
        <button className="px-4 py-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-semibold rounded transition">
          Register
        </button>
      </div>
    </div>
  );
}
