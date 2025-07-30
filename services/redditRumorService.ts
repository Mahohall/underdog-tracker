
import type { NewsHeadline } from '../types';

export async function fetchRedditRumors(teamName: string): Promise<NewsHeadline[]> {
  const headlines: NewsHeadline[] = [];

  // Target Reddit search via HTML (unofficial - no API)
 const searchUrl = `https://www.reddit.com/search/?q=${encodeURIComponent(teamName + " injury OR lineup OR suspension")}&sort=new`;

  try {
    const response = await fetch(searchUrl);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const postTitles = doc.querySelectorAll('h3');

    postTitles.forEach((el, index) => {
      if (index < 3 && el.textContent) {
        headlines.push({
          title: el.textContent.trim(),
          source: "Reddit",
          publishedAgo: "unknown" // Reddit's public HTML doesn't include timestamp
        });
      }
    });
  } catch (error) {
    console.error(\`Error scraping Reddit for \${teamName} rumors:\`, error);
  }

  return headlines;
}
