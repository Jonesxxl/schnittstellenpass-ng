import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { HomeComponent } from './home.component';
import { ContentService, DEFAULT_ABOUT_INTRO, DEFAULT_EPISODES, DEFAULT_LIVE, DEFAULT_SOCIAL } from '../services/content.service';
import { SpotifyService } from '../services/spotify.service';
import { InstagramFeedService, InstagramPost } from '../services/instagram-feed.service';
import { Episode } from '../models/spotify.models';

describe('HomeComponent', () => {
  const episodeNumber = (n: number): Episode => ({
    id: 'e' + n,
    title: n === 1 ? 'Die Zukunft des Amateurfußballs' : `Folge ${n}`,
    code: n === 1 ? 'S4 · 9' : null,
    description: `Beschreibung ${n}`,
    date: `${22 - n}.09.2026`,
    duration: '45:00',
    spotifyUrl: 'https://open.spotify.com/episode/e' + n,
    imageUrl: '/.netlify/functions/spotify?image=e' + n,
    audioPreviewUrl: null
  });
  const episode = episodeNumber(1);
  const latestSix = [1, 2, 3, 4, 5, 6].map(episodeNumber);

  const instagramPost = (id: string, caption = ''): InstagramPost => ({
    id,
    permalink: `https://www.instagram.com/p/${id}/`,
    caption,
    mediaType: 'IMAGE',
    timestamp: '2026-09-20T18:00:00+0000',
    image: `/.netlify/functions/instagram?image=${id}`
  });

  // settle: wait for all resources; not possible while an episode request is deliberately left pending
  async function render(
    latestEpisodes: Observable<Episode[] | null>,
    settle = true,
    instagramPosts: Observable<InstagramPost[]> = of([])
  ): Promise<HTMLElement> {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: SpotifyService, useValue: { getLatestEpisodes: () => latestEpisodes } },
        { provide: InstagramFeedService, useValue: { getLatestPosts: () => instagramPosts } },
        {
          provide: ContentService,
          useValue: {
            getHomeHeroContent: () => of({ titleLines: ['Erste Zeile', 'Zweite Zeile'], subtitle: 'Unterzeile aus dem CMS' }),
            getAboutIntroContent: () => of({ ...DEFAULT_ABOUT_INTRO, headline: 'Gastgeber aus dem CMS', body: 'Text aus dem CMS' }),
            getLiveContent: () => of(DEFAULT_LIVE),
            getEpisodesContent: () => of(DEFAULT_EPISODES),
            getSocialContent: () => of(DEFAULT_SOCIAL)
          }
        }
      ]
    });
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    if (settle) {
      await fixture.whenStable();
    }
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const text = (root: HTMLElement, selector: string) => root.querySelector(selector)?.textContent?.replace(/\s+/g, ' ').trim();
  const episodeCard = (root: HTMLElement) => root.querySelector<HTMLAnchorElement>('#top a[aria-busy]')!;

  it('should show the hero and host texts from the CMS', async () => {
    const root = await render(of(latestSix));

    expect(root.querySelector('#top h1')!.innerHTML).toContain('<br>');
    expect(text(root, '#top h1')).toBe('Erste Zeile Zweite Zeile');
    expect(text(root, '#top p')).toBe('Unterzeile aus dem CMS');
    expect(text(root, '#ueber h2')).toBe('Gastgeber aus dem CMS');
    expect(text(root, '#ueber p')).toBe('Text aus dem CMS');
  });

  it('should show the latest episode from Spotify', async () => {
    const root = await render(of(latestSix));
    const card = episodeCard(root);

    expect(card.getAttribute('href')).toBe('https://open.spotify.com/episode/e1');
    expect(card.textContent).toContain('Die Zukunft des Amateurfußballs');
    expect(card.textContent).toContain('45:00');
    expect(card.textContent).toContain('Folge vom 21.09.2026');
    expect(card.querySelector('img')!.getAttribute('src')).toBe('/.netlify/functions/spotify?image=e1');
  });

  it('should show a loading state until Spotify has answered', async () => {
    const root = await render(new Subject<Episode[] | null>(), false);
    const card = episodeCard(root);

    expect(card.getAttribute('aria-busy')).toBe('true');
    expect(card.textContent).toContain('Wird geladen');
    expect(card.querySelector('img')).toBeNull();
  });

  it('should fall back to the podcast cover and show link if Spotify is unavailable', async () => {
    const root = await render(of(null));
    const card = episodeCard(root);

    expect(card.getAttribute('href')).toBe('https://open.spotify.com/show/4gpxvhJ8WyrGAnba5A6LQc');
    expect(card.textContent).toContain('Alle Folgen auf Spotify');
    expect(card.querySelector('img')!.getAttribute('src')).toBe('assets/cover.jpg');
  });

  it('should list the latest episodes, each linking to the episode', async () => {
    const root = await render(of(latestSix));
    const rows = root.querySelectorAll<HTMLAnchorElement>('#folgen a[href*="open.spotify.com/episode/"]');

    expect(text(root, '#folgen h2')).toBe('Neueste Folgen');
    expect(Array.from(rows).map(row => row.getAttribute('href'))).toEqual(latestSix.map(item => item.spotifyUrl));
    expect(rows[0].getAttribute('target')).toBe('_blank');
    expect(rows[0].textContent).toContain('Die Zukunft des Amateurfußballs');
    expect(rows[0].textContent).toContain('S4 · 9');
    expect(rows[0].textContent).toContain('21.09.2026');
    expect(rows[0].textContent).toContain('Beschreibung 1');
    expect(root.querySelector('#folgen [aria-busy] a[href*="open.spotify.com/show"]')).toBeNull();
  });

  it('should show placeholder rows while the episodes are loading', async () => {
    const root = await render(new Subject<Episode[] | null>(), false);

    expect(root.querySelector('#folgen [aria-busy]')!.getAttribute('aria-busy')).toBe('true');
    expect(root.querySelectorAll('#folgen [aria-busy] > div[aria-hidden="true"]').length).toBe(6);
    expect(root.querySelector('#folgen [aria-busy] a')).toBeNull();
  });

  it('should link to the show if the episodes cannot be loaded', async () => {
    const root = await render(of(null));
    const rows = root.querySelectorAll<HTMLAnchorElement>('#folgen [aria-busy] a');

    expect(rows.length).toBe(1);
    expect(rows[0].getAttribute('href')).toBe('https://open.spotify.com/show/4gpxvhJ8WyrGAnba5A6LQc');
    expect(rows[0].textContent).toContain('Alle Folgen auf Spotify');
  });

  it('should show the Instagram section with the texts from the CMS', async () => {
    const root = await render(of(latestSix), true, of([instagramPost('1', 'Neue Folge ist online')]));

    expect(text(root, '#social app-instagram-feed h2')).toBe(DEFAULT_SOCIAL.headline);
    expect(root.querySelector('#social a[href="https://www.instagram.com/p/1/"]')).not.toBeNull();
  });

  it('should link "Alle Folgen anhören" to Spotify like the other listen buttons', async () => {
    const root = await render(of(latestSix));
    const allEpisodes = Array.from(root.querySelectorAll<HTMLAnchorElement>('#folgen a')).find(link => link.textContent?.includes('Alle Folgen anhören'))!;

    expect(allEpisodes.getAttribute('href')).toBe('https://open.spotify.com/show/4gpxvhJ8WyrGAnba5A6LQc');
  });
});
