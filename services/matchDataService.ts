
import type { Match, Team } from '../types';

function formatDateForBBC(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const yyyy = date.getFullYear();
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  return \`\${yyyy}-\${mm}-\${dd}\`;
}

export async function fetchMatchesByDayOffset(offsetDays: number): Promise<Match[]> {
  const datePath = formatDateForBBC(offsetDays);
  const url = \`https://www.bbc.com/sport/football/scores-fixtures/\${datePath}\`;
  const response = await fetch(url);
  const html = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const matches: Match[] = [];

  const matchElements = doc.querySelectorAll('[data-testid="match-block"]');

  matchElements.forEach((block) => {
    const teamElements = block.querySelectorAll('[data-testid="team-name"]');
    if (teamElements.length === 2) {
      const homeTeam: Team = {
        name: teamElements[0].textContent?.trim() || 'Unknown',
        logoUrl: ''
      };
      const awayTeam: Team = {
        name: teamElements[1].textContent?.trim() || 'Unknown',
        logoUrl: ''
      };

      matches.push({
        homeTeam,
        awayTeam,
        kickoffTime: 'TBD',
        league: 'Unknown'
      });
    }
  });

  return matches;
}
