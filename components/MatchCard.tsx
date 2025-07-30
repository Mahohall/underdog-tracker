
import React from 'react';
import type { Match } from '../types';
import { Calendar, Clock } from 'lucide-react';

interface MatchCardProps {
  match: Match;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700 transition-all hover:border-indigo-500 hover:shadow-indigo-500/10">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3 w-2/5">
          <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="w-8 h-8 object-contain"/>
          <span className="font-semibold text-white text-lg truncate">{match.homeTeam.name}</span>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-indigo-400">{match.date}</div>
          <div className="text-2xl font-mono text-gray-300">{match.matchTime}</div>
        </div>
        <div className="flex items-center space-x-3 w-2/5 justify-end">
          <span className="font-semibold text-white text-lg truncate text-right">{match.awayTeam.name}</span>
          <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="w-8 h-8 object-contain"/>
        </div>
      </div>
    </div>
  );
};
