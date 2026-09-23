import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { HomeComponent } from './home.component';
import { ContentService } from '../services/content.service';
import { SpotifyService } from '../services/spotify.service';
import { InstagramFeedService, InstagramPost } from '../services/instagram-feed.service';
import { Episode } from '../models/spotify.models';

describe('HomeComponent', () => {
  const episode: Episode = {
    id: 'e1',
    title: 'Die Zukunft des Amateurfußballs',
    description: '',
    date: '22.09.2026',
    duration: '45:00',
    spotifyUrl: 'https://open.spotify.com/episode/e1',
    imageUrl: 'https://i.scdn.co/image/e1',
    audioPreviewUrl: null
  };

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
    latestEpisode: Observable<Episode | null>,
    settle = true,
    instagramPosts: Observable<InstagramPost[]> = of([])
  ): Promise<HTMLElement> {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: SpotifyService, useValue: { getLatestEpisode: () => latestEpisode } },
        { provide: InstagramFeedService, useValue: { getLatestPosts: () => instagramPosts } },
        {
          provide: ContentService,
          useValue: {
            getHomeHeroContent: () => of({ titleLines: ['Erste Zeile', 'Zweite Zeile'], subtitle: 'Unterzeile aus dem CMS' }),
            getAboutIntroContent: () => of({ headline: 'Gastgeber aus dem CMS', body: 'Text aus dem CMS' })
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
    const root = await render(of(episode));

    expect(root.querySelector('#top h1')!.innerHTML).toContain('<br>');
    expect(text(root, '#top h1')).toBe('Erste Zeile Zweite Zeile');
    expect(text(root, '#top p')).toBe('Unterzeile aus dem CMS');
    expect(text(root, '#ueber h2')).toBe('Gastgeber aus dem CMS');
    expect(text(root, '#ueber p')).toBe('Text aus dem CMS');
  });

  it('should show the latest episode from Spotify', async () => {
    const root = await render(of(episode));
    const card = episodeCard(root);

    expect(card.getAttribute('href')).toBe('https://open.spotify.com/episode/e1');
    expect(card.textContent).toContain('Die Zukunft des Amateurfußballs');
    expect(card.textContent).toContain('45:00');
    expect(card.textContent).toContain('Folge vom 22.09.2026');
    expect(card.querySelector('img')!.getAttribute('src')).toBe('https://i.scdn.co/image/e1');
  });

  it('should show a loading state until Spotify has answered', async () => {
    const root = await render(new Subject<Episode | null>(), false);
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

  it('should list the featured episodes', async () => {
    const root = await render(of(episode));
    const rows = root.querySelectorAll('#folgen a[href*="open.spotify.com/show"]');

    expect(rows.length).toBe(6);
    expect(rows[0].textContent).toContain('Sebastian „Kiwi“ Müller');
  });

  it('should link the Instagram tiles to the latest posts', async () => {
    const root = await render(of(episode), true, of([instagramPost('1', 'Neue Folge ist online'), instagramPost('2')]));
    const links = root.querySelectorAll<HTMLAnchorElement>('#social a[href*="instagram.com/p/"]');

    expect(links.length).toBe(2);
    expect(links[0].getAttribute('href')).toBe('https://www.instagram.com/p/1/');
    expect(links[0].getAttribute('target')).toBe('_blank');
    expect(links[0].querySelector('img')!.getAttribute('src')).toBe('/.netlify/functions/instagram?image=1');
    expect(links[0].querySelector('img')!.getAttribute('alt')).toBe('Instagram-Beitrag: Neue Folge ist online');
    expect(links[1].querySelector('img')!.getAttribute('alt')).toBe('Instagram-Beitrag von Schnittstellenpass');
    // The remaining tiles keep their placeholders
    expect(text(root, '#social .placeholder')).toBe('Instagram-Post 3');
    expect(root.querySelectorAll('#social .placeholder').length).toBe(2);
  });

  it('should keep the Instagram placeholders while loading and if the feed is unavailable', async () => {
    const loading = await render(of(episode), false, new Subject<InstagramPost[]>());
    expect(loading.querySelector('#social [aria-busy]')!.getAttribute('aria-busy')).toBe('true');
    expect(loading.querySelectorAll('#social .placeholder').length).toBe(4);

    TestBed.resetTestingModule();
    const unavailable = await render(of(episode), true, of([]));
    expect(unavailable.querySelector('#social [aria-busy]')!.getAttribute('aria-busy')).toBe('false');
    expect(unavailable.querySelectorAll('#social .placeholder').length).toBe(4);
    expect(unavailable.querySelector('#social a[href*="instagram.com/p/"]')).toBeNull();
  });
});
