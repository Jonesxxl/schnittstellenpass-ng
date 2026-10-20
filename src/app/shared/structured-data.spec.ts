import { Episode } from '../models/spotify.models';
import { podcastStructuredData, setJsonLd } from './structured-data';

describe('structured data', () => {
  const episode: Episode = {
    id: 'e1',
    title: 'Hat der VAR den Fußball besser gemacht?',
    code: null,
    description: 'Live mit FIFA-Videoschiedsrichter Pascal Müller.',
    date: '27.09.2026',
    releaseDate: '2026-09-27',
    duration: '55:03',
    durationMs: 3_303_000,
    spotifyUrl: 'https://open.spotify.com/episode/e1',
    imageUrl: '',
    audioPreviewUrl: null
  };

  const graph = (episodes: Episode[] = [episode]) =>
    (podcastStructuredData({ description: 'Der Fußball-Podcast', hostImage: 'assets/host-portrait.webp', episodes }) as { '@graph': Record<string, unknown>[] })['@graph'];
  const ofType = (type: string, episodes?: Episode[]) => graph(episodes).filter(node => node['@type'] === type);

  it('should describe the podcast with its feed, host and profiles', () => {
    const [podcast] = ofType('PodcastSeries');

    expect(podcast['webFeed']).toBe('https://anchor.fm/s/fead9f68/podcast/rss');
    expect(podcast['description']).toBe('Der Fußball-Podcast');
    expect(podcast['author']).toEqual({ '@id': 'https://schnittstellenpass.de/#host' });
    expect(podcast['sameAs']).toContain('https://www.instagram.com/schnittstellenpass/');
    expect(ofType('Person')[0]['image']).toBe('https://schnittstellenpass.de/assets/host-portrait.webp');
    expect(ofType('WebSite')[0]['about']).toEqual({ '@id': podcast['@id'] });
  });

  it('should list the episodes with date, ISO duration and series', () => {
    const [entry] = ofType('PodcastEpisode');

    expect(entry['name']).toBe('Hat der VAR den Fußball besser gemacht?');
    expect(entry['url']).toBe('https://open.spotify.com/episode/e1');
    expect(entry['datePublished']).toBe('2026-09-27');
    expect(entry['timeRequired']).toBe('PT55M3S');
    expect(entry['partOfSeries']).toEqual({ '@id': 'https://schnittstellenpass.de/#podcast' });
  });

  it('should point episodes with a page on this site to that page', () => {
    const [entry] = ofType('PodcastEpisode', [{ ...episode, slug: 'hat-der-var' }]);

    expect(entry['url']).toBe('https://schnittstellenpass.de/folgen/hat-der-var');
  });

  it('should write hours and full minutes in ISO durations', () => {
    const durations = [3_725_000, 3_600_000, 45_000].map(durationMs => ofType('PodcastEpisode', [{ ...episode, durationMs }])[0]['timeRequired']);

    expect(durations).toEqual(['PT1H2M5S', 'PT1H', 'PT45S']);
  });

  it('should shorten long descriptions at a word boundary', () => {
    const description = ofType('PodcastEpisode', [{ ...episode, description: 'Wort '.repeat(200) }])[0]['description'] as string;

    expect(Array.from(description).length).toBeLessThanOrEqual(300);
    expect(description).toMatch(/Wort…$/);
  });

  describe('setJsonLd', () => {
    afterEach(() => document.getElementById('test-json-ld')?.remove());

    it('should keep one script and escape "<" so text cannot close the tag', () => {
      setJsonLd(document, 'test-json-ld', { name: 'erste' });
      setJsonLd(document, 'test-json-ld', { name: '</script><script>alert(1)</script>' });

      const scripts = document.head.querySelectorAll('#test-json-ld');
      expect(scripts.length).toBe(1);
      expect(scripts[0].getAttribute('type')).toBe('application/ld+json');
      expect(scripts[0].textContent).not.toContain('<');
      expect(JSON.parse(scripts[0].textContent!)).toEqual({ name: '</script><script>alert(1)</script>' });
    });

    it('should remove the script for null', () => {
      setJsonLd(document, 'test-json-ld', { name: 'weg' });
      setJsonLd(document, 'test-json-ld', null);

      expect(document.getElementById('test-json-ld')).toBeNull();
    });
  });
});
