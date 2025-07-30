
import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { FlaggedMatchCard } from './components/FlaggedMatchCard';
import { fetchMatchesByDayOffset } from './services/matchDataService';
import { fetchTeamNews } from './services/newsScannerService';
import { fetchRedditRumors } from './services/redditRumorService';
import { geminiService } from './services/geminiService';
import { fetchOddsForMatches, fetchUpdatedOdds } from './services/oddsScraperService';
import { calculateSimulatedProfit } from './services/simulatorService';
import type { MatchWithOdds, FlaggedMatch, NewsHeadline } from './types';
import { Loader, AlertTriangle } from 'lucide-react';

export default function App() {
  const [flaggedMatches, setFlaggedMatches] = useState<FlaggedMatch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [minDogOdds, setMinDogOdds] = useState<number>(3.0);
  const [daysAhead, setDaysAhead] = useState<number>(1);

  const runAnalysis = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let allMatches: MatchWithOdds[] = [];

      for (let day = 0; day < daysAhead; day++) {
        const fixtures = await fetchMatchesByDayOffset(day);
        const matchesWithOdds = await fetchOddsForMatches(fixtures);
        allMatches = allMatches.concat(matchesWithOdds);
      }

      const filteredMatches = allMatches.filter(match =>
        match.dogOdds >= minDogOdds
      );

      const updatedFlagged: FlaggedMatch[] = [];

      for (const match of filteredMatches) {
        const favTeam = match.favourite === 'home' ? match.homeTeam : match.awayTeam;
        const newsList: NewsHeadline[] = await fetchTeamNews(favTeam.name);
        const redditList: NewsHeadline[] = await fetchRedditRumors(favTeam.name);
        const combinedHeadlines = [...newsList, ...redditList];

        for (const headline of combinedHeadlines) {
          const analysis = await geminiService.analyzeHeadline(
            favTeam.name,
            headline.title,
            headline.source
          );

          if (analysis && analysis.isNegative) {
            const now = new Date();
            const kickoff = new Date(now.getTime() + 25 * 60000); // Simulate kickoff in 25 mins
            const timeUntilKickoff = (kickoff.getTime() - now.getTime()) / 60000;

            const flagged: FlaggedMatch = {
              ...match,
              headline: headline.title,
              source: headline.source,
              publishedAgo: headline.publishedAgo,
              analysisReason: analysis.reason,
              impactScore: analysis.impactScore,
              initialDogOdds: match.dogOdds
            };

            if (timeUntilKickoff <= 20 && timeUntilKickoff > 10) {
              const updatedOdds = await fetchUpdatedOdds(match);
              const simulatedProfit = calculateSimulatedProfit(match.dogOdds, updatedOdds);
              flagged.finalDogOdds = updatedOdds;
              flagged.simulatedProfit = simulatedProfit;
            }

            updatedFlagged.push(flagged);
            break;
          }
        }
      }

      setFlaggedMatches(updatedFlagged);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch or analyze match data.');
    }

    setIsLoading(false);
  };

  useEffect(() => {
    runAnalysis();
    const intervalId = setInterval(() => {
      runAnalysis();
    }, 10 * 60 * 1000); // Every 10 minutes
    return () => clearInterval(intervalId);
  }, [minDogOdds, daysAhead]);

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <section className="max-w-4xl mx-auto p-4">
        <div className="mb-4 flex flex-col gap-2">
          <label>
            Minimum Underdog Odds:
            <input
              type="number"
              step="0.1"
              value={minDogOdds}
              onChange={e => setMinDogOdds(parseFloat(e.target.value))}
              className="ml-2 p-1 border rounded"
            />
          </label>
          <label>
            Scan how many days ahead?
            <select
              value={daysAhead}
              onChange={e => setDaysAhead(parseInt(e.target.value))}
              className="ml-2 p-1 border rounded"
            >
              <option value={1}>Today</option>
              <option value={2}>Today + Tomorrow</option>
              <option value={3}>Next 3 Days</option>
              <option value={4}>Next 4 Days</option>
            </select>
          </label>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-lg text-blue-600">
            <Loader className="animate-spin" /> Scanning matches and simulating odds...
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-lg text-red-600">
            <AlertTriangle /> {error}
          </div>
        )}

        {!isLoading && flaggedMatches.length === 0 && (
          <p className="text-gray-700 text-center">No matches flagged. No concerning news or rumors detected.</p>
        )}

        {flaggedMatches.map((match, index) => (
          <FlaggedMatchCard key={index} match={match} />
        ))}
      </section>
    </main>
  );
}
