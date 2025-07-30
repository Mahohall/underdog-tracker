
import React from 'react';
import type { FlaggedMatch } from '../types';

interface Props {
  match: FlaggedMatch;
}

export const FlaggedMatchCard: React.FC<Props> = ({ match }) => {
  return (
    <div className="border rounded-xl bg-white p-4 shadow mb-4">
      <h2 className="text-lg font-bold mb-2">
        {match.homeTeam.name} vs {match.awayTeam.name}
      </h2>
      <p className="text-sm text-gray-600 mb-1">
        Favourite: {match.favourite === 'home' ? match.homeTeam.name : match.awayTeam.name} ({match.favOdds})
      </p>
      <p className="text-sm text-gray-600 mb-1">
        Underdog: {match.favourite === 'home' ? match.awayTeam.name : match.homeTeam.name} ({match.dogOdds})
      </p>
      <p className="text-sm text-blue-800 mt-2">⚠️ {match.headline}</p>
      <p className="text-xs text-gray-500">Source: {match.source} • {match.publishedAgo}</p>
      <p className="text-sm text-gray-700 mt-1">🧠 {match.analysisReason} (Impact: {match.impactScore}/10)</p>

      {match.simulatedProfit !== undefined && (
        <div className="mt-2 p-2 bg-green-50 border border-green-300 rounded text-sm text-green-700">
          💸 Simulated Profit: +{match.simulatedProfit}% if cashed out before kickoff
        </div>
      )}
    </div>
  );
};
