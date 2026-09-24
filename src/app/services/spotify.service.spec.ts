import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SpotifyService } from './spotify.service';
import { Episode, SpotifyEpisodesResponse } from '../models/spotify.models';

describe('SpotifyService', () => {
  let service: SpotifyService;
  let httpMock: HttpTestingController;

  const episodesResponse: SpotifyEpisodesResponse = {
    items: [{
      id: 'ep1',
      name: 'Folge 1',
      description: '<p>Taktik &amp; Analyse</p>',
      release_date: '2026-09-01',
      duration_ms: 3_725_000,
      external_urls: { spotify: 'https://open.spotify.com/episode/ep1' },
      images: [{ url: 'https://i.scdn.co/image/ep1', height: 640, width: 640 }],
      audio_preview_url: null,
      html_description: '<p>Taktik &amp; Analyse</p>',
      language: 'de',
      explicit: false
    }],
    total: 1,
    limit: 1,
    offset: 0,
    next: null,
    previous: null
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(SpotifyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Fails if any unexpected request was made, e.g. a direct call to
  // accounts.spotify.com that would require credentials in the browser
  afterEach(() => httpMock.verify());

  it('should load episodes through the server-side proxy without credentials', () => {
    let total: number | undefined;
    service.getEpisodes(5, 10).subscribe(response => total = response.total);

    const req = httpMock.expectOne(r => r.url === '/.netlify/functions/spotify');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('resource')).toBe('episodes');
    expect(req.request.params.get('limit')).toBe('5');
    expect(req.request.params.get('offset')).toBe('10');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush(episodesResponse);

    expect(total).toBe(1);
  });

  it('should transform the latest episodes', () => {
    let latest: Episode[] | null | undefined;
    service.getLatestEpisodes(6).subscribe(episodes => latest = episodes);

    httpMock.expectOne(r => r.params.get('resource') === 'episodes' && r.params.get('limit') === '6' && r.params.get('offset') === '0')
      .flush(episodesResponse);

    expect(latest?.length).toBe(1);
    expect(latest![0]).toEqual(jasmine.objectContaining({
      id: 'ep1',
      title: 'Folge 1',
      code: null,
      description: 'Taktik & Analyse',
      duration: '1:02:05',
      spotifyUrl: 'https://open.spotify.com/episode/ep1',
      imageUrl: 'https://i.scdn.co/image/ep1',
      audioPreviewUrl: null
    }));
    expect(latest![0].date).toMatch(/^\d{2}\.\d{2}\.2026$/);
  });

  it('should move the season and episode number from the title into a code', () => {
    const named = (id: string, name: string) => ({ ...episodesResponse.items[0]!, id, name });
    let latest: Episode[] | null | undefined;
    service.getLatestEpisodes(6).subscribe(episodes => latest = episodes);

    httpMock.expectOne(r => r.params.get('resource') === 'episodes').flush({
      ...episodesResponse,
      items: [
        named('a', 'Die neuen Julian Nagelsmänner mit Leo Sohn - Saison 4 Folge #8'),
        null,
        named('b', 'Saison 3, Folge 12 – Der rasende Reporter'),
        named('c', 'Einmal (Real) Madrid und zurück - Mit Jannis Fischer'),
        named('d', 'Saison 2 Folge 1')
      ]
    });

    expect(latest!.map(episode => [episode.id, episode.title, episode.code])).toEqual([
      ['a', 'Die neuen Julian Nagelsmänner mit Leo Sohn', 'S4 · 8'],
      ['b', 'Der rasende Reporter', 'S3 · 12'],
      ['c', 'Einmal (Real) Madrid und zurück - Mit Jannis Fischer', null],
      // Nothing left without the code: keep the full title
      ['d', 'Saison 2 Folge 1', null]
    ]);
  });

  it('should resolve the latest episodes to null when the proxy fails', () => {
    const consoleError = spyOn(console, 'error');
    let latest: Episode[] | null | undefined;
    service.getLatestEpisodes(6).subscribe(episodes => latest = episodes);

    httpMock.expectOne(r => r.params.get('resource') === 'episodes')
      .flush({ error: 'Spotify request failed' }, { status: 502, statusText: 'Bad Gateway' });

    expect(latest).toBeNull();
    expect(consoleError).toHaveBeenCalled();
  });
});
