
import type { Match, NewsHeadline, Team } from '../types';

const TEAMS_LIST: Team[] = [
    // Premier League
    { name: 'Manchester City', logoUrl: 'https://picsum.photos/seed/mancity/64/64' },
    { name: 'Liverpool', logoUrl: 'https://picsum.photos/seed/liverpool/64/64' },
    { name: 'Arsenal', logoUrl: 'https://picsum.photos/seed/arsenal/64/64' },
    { name: 'Manchester Utd', logoUrl: 'https://picsum.photos/seed/manutd/64/64' },
    { name: 'Chelsea', logoUrl: 'https://picsum.photos/seed/chelsea/64/64' },
    { name: 'Tottenham', logoUrl: 'https://picsum.photos/seed/tottenham/64/64' },
    { name: 'Newcastle Utd', logoUrl: 'https://picsum.photos/seed/newcastle/64/64' },
    // La Liga
    { name: 'Real Madrid', logoUrl: 'https://picsum.photos/seed/realmadrid/64/64' },
    { name: 'Barcelona', logoUrl: 'https://picsum.photos/seed/barcelona/64/64' },
    { name: 'Atletico Madrid', logoUrl: 'https://picsum.photos/seed/atletico/64/64' },
    // Serie A
    { name: 'Juventus', logoUrl: 'https://picsum.photos/seed/juventus/64/64' },
    { name: 'Inter Milan', logoUrl: 'https://picsum.photos/seed/intermilan/64/64' },
    { name: 'AC Milan', logoUrl: 'https://picsum.photos/seed/acmilan/64/64' },
    // Bundesliga
    { name: 'Bayern Munich', logoUrl: 'https://picsum.photos/seed/bayern/64/64' },
    { name: 'Borussia Dortmund', logoUrl: 'https://picsum.photos/seed/dortmund/64/64' },
    // Ligue 1
    { name: 'Paris Saint-Germain', logoUrl: 'https://picsum.photos/seed/psg/64/64' },
];

const HEADLINES_POOL = {
    NEGATIVE: [
        { title: 'Key striker facing late fitness test after picking up knock in training.', source: 'BBC Sport' },
        { title: 'Reports of dressing room unrest surface following last week\'s defeat.', source: 'Daily Mail' },
        { title: 'Star defender suspended for crucial upcoming match after red card appeal fails.', source: 'Sky Sports' },
        { title: 'Manager publicly criticizes players\' commitment, raising questions about team morale.', source: 'The Guardian' },
        { title: 'Goalkeeper set to miss match due to unexpected illness.', source: 'The Athletic' },
        { title: 'Leaked training ground footage shows striker limping heavily.', source: 'Twitter Fan Account' },
        { title: 'Player\'s agent seen meeting with rival club chairman.', source: 'Influential Blogger' },
        { title: 'Cryptic social media post from star player fuels rumors of discontent.', source: 'Player\'s Social Media' },
        { title: 'Defensive crisis deepens as another center-back is ruled out with injury.', source: 'ESPN' },
        { title: 'Contract talks with star player stall, leading to speculation about his future.', source: 'Fabrizio Romano' },
        { title: 'Senior journalist hints at major fallout between manager and key player on podcast.', source: 'Football Podcast' },
    ],
    NEUTRAL_OR_POSITIVE: [
        { title: 'Manager praises team\'s resilience and focus ahead of big game.', source: 'Club Website' },
        { title: 'Young talent expected to make his first start.', source: 'Goal.com' },
        { title: 'Team completes final training session with no new injury concerns.', source: 'TeamTalk' },
        { title: '"We are confident but not complacent," says captain in press conference.', source: 'Reuters' },
        { title: 'Club announces new community partnership initiative.', source: 'Official Statement' },
        { title: 'Pundits tip team for a comfortable victory based on recent form.', source: 'TalkSPORT' },
        { title: 'Record attendance expected for highly anticipated home game.', source: 'Stadium News' },
    ]
};

const PUBLISHED_AGO_POOL = ['15m ago', '45m ago', '2h ago', '5h ago', '11h ago', '1 day ago'];

// Helper to shuffle an array
const shuffle = <T>(array: T[]): T[] => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

const generateScenario = (): { matches: Match[]; news: Record<string, NewsHeadline> } => {
    const shuffledTeams = shuffle([...TEAMS_LIST]);
    const matches: Match[] = [];
    const news: Record<string, NewsHeadline> = {};
    const usedTeams = new Set<string>();
    
    const numFixtures = 6; // Generate 6 fixtures
    let matchId = 1;

    for (let i = 0; i < shuffledTeams.length - 1; i += 2) {
        if (matches.length >= numFixtures) break;

        const homeTeam = shuffledTeams[i];
        const awayTeam = shuffledTeams[i + 1];

        if (usedTeams.has(homeTeam.name) || usedTeams.has(awayTeam.name)) continue;

        const date = Math.random() > 0.4 ? 'Today' : 'Tomorrow';
        const hour = 14 + Math.floor(Math.random() * 7); // 14:00 - 20:00
        const minute = ['00', '15', '30', '45'][Math.floor(Math.random() * 4)];
        const matchTime = `${hour}:${minute}`;

        matches.push({ id: matchId++, homeTeam, awayTeam, matchTime, date });
        usedTeams.add(homeTeam.name);
        usedTeams.add(awayTeam.name);

        // Generate news for the favorite team (home team)
        const favoriteTeamName = homeTeam.name;
        // 80% chance of having a headline
        if (Math.random() < 0.8) { 
            const publishedAgo = shuffle([...PUBLISHED_AGO_POOL])[0];
            // 50% chance of it being negative
            if (Math.random() < 0.5) { 
                 const headline = shuffle([...HEADLINES_POOL.NEGATIVE])[0];
                 news[favoriteTeamName] = { ...headline, publishedAgo };
            } else { // 50% chance of it being neutral/positive
                 const headline = shuffle([...HEADLINES_POOL.NEUTRAL_OR_POSITIVE])[0];
                 news[favoriteTeamName] = { ...headline, publishedAgo };
            }
        }
    }

    return { matches, news };
};


export const mockDataService = {
  generateScenario,
};
