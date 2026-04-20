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

    return results.results.slice(0, 5).map((result) => {
      let hostname = 'web';
      try {
        const url = new URL(result.url || '');
        hostname = url.hostname.replace('www.', '');
      } catch {
        hostname = 'web';
      }

      return {
        title: result.title || '',
        link: result.url || '',
        snippet: result.description || '',
        source: hostname,
      };
    });
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

  // Format as course-style entries for better card rendering
  return results
    .map(
      (r) => `${r.title} - ${r.link}`
    )
    .join('\n');
}
