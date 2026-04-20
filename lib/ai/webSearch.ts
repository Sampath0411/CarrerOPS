import { search } from 'duck-duck-scrape';

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  source: string;
}

export async function searchWeb(query: string): Promise<SearchResult[]> {
  try {
    const results = await search(query, {
      safeSearch: 0,
      locale: 'en',
    });

    return results.results.slice(0, 5).map((result) => ({
      title: result.title || '',
      link: result.url || '',
      snippet: result.description || '',
      source: new URL(result.url || '').hostname || 'web',
    }));
  } catch (error) {
    console.error('Web search error:', error);
    return [];
  }
}

export async function fetchCareerData(
  mode: 'courses' | 'higher-ed',
  query: string
): Promise<SearchResult[]> {
  const searchQueries =
    mode === 'courses'
      ? `${query} best online courses certifications 2024`
      : `${query} universities admission requirements programs`;

  return await searchWeb(searchQueries);
}

export function formatSearchResults(results: SearchResult[]): string {
  if (results.length === 0) return '';

  return `
\n\nHere's what I found online:\n${results
    .map(
      (r, i) =>
        `${i + 1}. **${r.title}**\n   ${r.snippet}\n   Source: [${r.source}](${r.link})`
    )
    .join('\n\n')}`;
}
