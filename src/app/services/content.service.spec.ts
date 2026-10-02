import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AboutFact, ContentService, DEFAULT_ABOUT_INTRO, DEFAULT_EPISODES, DEFAULT_LIVE, EpisodesContent, LiveContent } from './content.service';

describe('ContentService', () => {
  let service: ContentService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ContentService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function loadLive(payload: Record<string, unknown>): LiveContent {
    let result: LiveContent | undefined;
    service.getLiveContent().subscribe(content => (result = content));
    http.expectOne('/content/live.json').flush(payload);
    return result!;
  }

  it('should read the live section from the CMS', () => {
    const live = loadLive({
      bannerText: 'Banner',
      headlineLines: [{ line: 'Zeile 1' }, { line: ' ' }, { line: 'Zeile 2' }],
      photo: '/uploads/live.jpg'
    });

    expect(live.bannerText).toBe('Banner');
    expect(live.headlineLines).toEqual(['Zeile 1', 'Zeile 2']);
    expect(live.photo).toBe('/uploads/live.jpg');
    // Missing fields keep their defaults
    expect(live.text).toBe(DEFAULT_LIVE.text);
  });

  it('should only accept pictures from the upload folder or the assets', () => {
    for (const photo of ['https://example.com/x.jpg', '//example.com/x.jpg', 'javascript:alert(1)', '/uploads/../x.jpg', 'data:image/png;base64,AAAA', 42]) {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
      service = TestBed.inject(ContentService);
      http = TestBed.inject(HttpTestingController);
      expect(loadLive({ photo: photo as unknown }).photo).withContext(String(photo)).toBe(DEFAULT_LIVE.photo);
    }
  });

  it('should fall back to the defaults if a file cannot be loaded', () => {
    let episodes: EpisodesContent | undefined;
    service.getEpisodesContent().subscribe(content => (episodes = content));
    http.expectOne('/content/folgen.json').flush('', { status: 404, statusText: 'Not Found' });

    expect(episodes).toEqual(DEFAULT_EPISODES);
  });

  it('should read only the section texts of the episodes, not a list of episodes', () => {
    let episodes: EpisodesContent | undefined;
    service.getEpisodesContent().subscribe(content => (episodes = content));
    http.expectOne('/content/folgen.json').flush({ headline: 'Aus dem CMS', intro: '', episodes: [{ guest: 'Gast' }] });
    expect(episodes).toEqual({ eyebrow: DEFAULT_EPISODES.eyebrow, headline: 'Aus dem CMS', intro: DEFAULT_EPISODES.intro });
  });

  it('should drop empty facts', () => {
    let facts: AboutFact[] | undefined;
    service.getAboutIntroContent().subscribe(content => (facts = content.facts));
    http.expectOne('/content/ueber-uns.json').flush({ facts: [{ value: '', label: 'leer' }] });
    expect(facts).toEqual(DEFAULT_ABOUT_INTRO.facts);
  });
});
