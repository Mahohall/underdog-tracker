
import type { NewsHeadline } from '../types';

export async function fetchTeamNews(teamName: string): Promise<NewsHeadline[]> {
  const headlines: NewsHeadline[] = [];

  // Normalize team name for URLs
  const searchQuery = encodeURIComponent(teamName + ' football');

  // Google News RSS Feed
  const googleNewsUrl = \`https://news.google.com/rss/search?q=\${searchQuery}&hl=en-GB&gl=GB&ceid=GB:en\`;

  try {
    const res = await fetch(googleNewsUrl);
    const xml = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const items = doc.querySelectorAll('item');

    items.forEach((item, i) => {
      if (i < 5) {
        const title = item.querySelector('title')?.textContent ?? '';
        const source = item.querySelector('source')?.textContent ?? 'Google News';
        const publishedAgo = item.querySelector('pubDate')?.textContent ?? '';

        headlines.push({
          title,
          source,
          publishedAgo
        });
      }
    });
  } catch (error) {
    console.error(\`Failed to fetch Google News for \${teamName}:\`, error);
  }

  return headlines;
}
