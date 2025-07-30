
import type { Match, MatchWithOdds } from '../types';

export async function fetchOddsForMatches(matches: Match[]): Promise<MatchWithOdds[]> {
  return matches.map((match, index) => {
    // Simulate odds (can later plug in real scraper)
    const homeOdds = +(Math.random() * 3 + 1).toFixed(2);
    const awayOdds = +(Math.random() * 3 + 1).toFixed(2);

    const favourite = homeOdds < awayOdds ? 'home' : 'away';
    const favOdds = favourite === 'home' ? homeOdds : awayOdds;
    const dogOdds = favourite === 'home' ? awayOdds : homeOdds;

    return {
      ...match,
      favOdds,
      dogOdds,
      favourite
    };
  });
}

export async function fetchUpdatedOdds(match: MatchWithOdds): Promise<number> {
  // Simulate the updated underdog odds 15 mins before kickoff
  const dropFactor = 0.6 + Math.random() * 0.3; // Odds drop by 30–40%
  const updatedOdds = +(match.dogOdds * dropFactor).toFixed(2);
  return updatedOdds;
}
