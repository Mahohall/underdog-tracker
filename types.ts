
export interface Team {
  name: string;
  logoUrl: string;
}

export interface Match {
  homeTeam: Team;
  awayTeam: Team;
  kickoffTime: string;
  league: string;
}

export interface MatchWithOdds extends Match {
  favOdds: number;
  dogOdds: number;
  favourite: 'home' | 'away';
}

export interface NewsHeadline {
  title: string;
  source: string;
  publishedAgo: string;
}

export interface FlaggedMatch extends MatchWithOdds {
  headline: string;
  source: string;
  publishedAgo: string;
  analysisReason: string;
  impactScore: number;
  initialDogOdds?: number; // for simulation
  finalDogOdds?: number;   // for simulation
  simulatedProfit?: number; // %
}
