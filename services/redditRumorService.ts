import axios from 'axios';
import * as cheerio from 'cheerio';

export async function fetchRedditRumors(teamName: string): Promise<string[]> {
  const rumors: string[] = [];

  // Target Reddit search via HTML (unofficial - no API)
  const searchUrl = `https://www.reddit.com/search/?q=${encodeURIComponent(teamName + " injury OR lineup OR suspension")}&sort=new`;

  try {
    const { data } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(data);
    $('a[data-click-id="body"]').each((_, el) => {
      const post = $(el).text();
      if (post.toLowerCase().includes('injury') || post.toLowerCase().includes('lineup') || post.toLowerCase().includes('suspension')) {
        rumors.push(post);
      }
    });

    return rumors.slice(0, 5); // return top 5 matching posts
  } catch (error) {
    console.error('Error fetching Reddit rumors:', error);
    return [];
  }
}
