export async function fetchNews(query: string) {
  const response = await fetch(
    `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-GB&gl=GB&ceid=GB:en`
  );
  const text = await response.text();
  return text;
}