import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, convertToParamMap } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { FeedEpisode, FolgenService, formatDate, formatDuration } from './folgen.service';
import { episodeDescription, episodeTitle } from './folgen.resolvers';

describe('FolgenService', () => {
  let service: FolgenService;
  let http: HttpTestingController;

  const episode: FeedEpisode = {
    slug: 'der-profimacher-mit-edgar-beck',
    title: 'Der Profimacher - mit Edgar Beck',
    code: 'S2 · 1',
    date: '2022-01-14',
    durationSeconds: 2365,
    summary: 'Edgar Beck erzählt, wie aus Talenten Profis werden. '.repeat(6).trim(),
    listenUrl: 'https://podcasters.spotify.com/pod/show/agyschnittstellenpass/episodes/Der-Profimacher',
    descriptionHtml: '<p>Edgar Beck erzählt …</p>'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(FolgenService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should list no episodes if the build wrote none', async () => {
    const episodes = firstValueFrom(service.episodes());
    http.expectOne('/generated/folgen/index.json').flush('Not found', { status: 404, statusText: 'Not Found' });

    expect(await episodes).toEqual([]);
  });

  it('should load an episode once for title, description and page', async () => {
    const first = firstValueFrom(service.episode(episode.slug));
    const second = firstValueFrom(service.episode(episode.slug));
    http.expectOne(`/generated/folgen/${episode.slug}.json`).flush(episode);

    expect(await first).toEqual(episode);
    expect(await second).toEqual(episode);
  });

  it('should not request anything for a slug that is no file name', async () => {
    expect(await firstValueFrom(service.episode('../index'))).toBeNull();
    expect(await firstValueFrom(service.episode('Grossbuchstaben'))).toBeNull();
  });

  it('should resolve a missing episode to null', async () => {
    const missing = firstValueFrom(service.episode('gibt-es-nicht'));
    http.expectOne('/generated/folgen/gibt-es-nicht.json').flush('Not found', { status: 404, statusText: 'Not Found' });

    expect(await missing).toBeNull();
  });

  describe('resolvers', () => {
    const resolve = <T>(resolver: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => unknown, slug: string) =>
      TestBed.runInInjectionContext(() => firstValueFrom(resolver({ paramMap: convertToParamMap({ slug }) } as ActivatedRouteSnapshot, {} as RouterStateSnapshot) as Observable<T>));

    it('should name the page after the episode and describe it with the start of the show notes', async () => {
      const title = resolve<string>(episodeTitle, episode.slug);
      const description = resolve<string>(episodeDescription, episode.slug);
      http.expectOne(`/generated/folgen/${episode.slug}.json`).flush(episode);

      expect(await title).toBe('Der Profimacher - mit Edgar Beck – Schnittstellenpass');
      const text = await description;
      expect(Array.from(text).length).toBeLessThanOrEqual(160);
      expect(text).toMatch(/^Edgar Beck erzählt, wie aus Talenten Profis werden\..*…$/);
    });

    it('should say so for an unknown episode', async () => {
      expect(await resolve<string>(episodeTitle, '../x')).toBe('Folge nicht gefunden – Schnittstellenpass');
    });
  });

  it('should format date and duration as on the site', () => {
    expect(formatDate('2026-09-27')).toBe('27.09.2026');
    expect([3303, 4601, 3600].map(formatDuration)).toEqual(['55 Min.', '1 Std. 17 Min.', '1 Std.']);
  });
});
