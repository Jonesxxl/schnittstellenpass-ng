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

  it('should transform the latest episode', () => {
    let latest: Episode | null | undefined;
    service.getLatestEpisode().subscribe(episode => latest = episode);

    httpMock.expectOne(r => r.params.get('resource') === 'episodes' && r.params.get('limit') === '1')
      .flush(episodesResponse);

    expect(latest).toEqual(jasmine.objectContaining({
      id: 'ep1',
      title: 'Folge 1',
      description: 'Taktik & Analyse',
      duration: '1:02:05',
      spotifyUrl: 'https://open.spotify.com/episode/ep1',
      imageUrl: 'https://i.scdn.co/image/ep1',
      audioPreviewUrl: null
    }));
    expect(latest?.date).toMatch(/^\d{2}\.\d{2}\.2026$/);
  });

  it('should resolve the latest episode to null when the proxy fails', () => {
    const consoleError = spyOn(console, 'error');
    let latest: Episode | null | undefined;
    service.getLatestEpisode().subscribe(episode => latest = episode);

    httpMock.expectOne(r => r.params.get('resource') === 'episodes')
      .flush({ error: 'Spotify request failed' }, { status: 502, statusText: 'Bad Gateway' });

    expect(latest).toBeNull();
    expect(consoleError).toHaveBeenCalled();
  });
});
