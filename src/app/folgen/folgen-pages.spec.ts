import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { FolgeComponent } from './folge.component';
import { FolgenArchiveComponent } from './folgen-archive.component';
import { FeedEpisode, FeedEpisodeSummary, FolgenService } from './folgen.service';

describe('Folgen pages', () => {
  const summary: FeedEpisodeSummary = {
    slug: 'die-woelfe-von-morgen-mit-johannes-meyer',
    title: 'Die Wölfe von Morgen mit Johannes Meyer',
    code: 'S4 · 9',
    date: '2024-11-07',
    durationSeconds: 3125,
    summary: 'Johannes Meyer über die Nachwuchsarbeit beim VfL Wolfsburg.',
    listenUrl: 'https://podcasters.spotify.com/pod/show/agyschnittstellenpass/episodes/Die-Woelfe'
  };
  const episode: FeedEpisode = {
    ...summary,
    descriptionHtml: '<p>Johannes Meyer über die <strong>Nachwuchsarbeit</strong>.</p><script>alert(1)</script><ul><li>Kapitel 1</li></ul>'
  };

  const text = (root: HTMLElement, selector: string) => root.querySelector(selector)?.textContent?.replace(/\s+/g, ' ').trim();

  describe('FolgeComponent', () => {
    async function render(value: FeedEpisode | null, list: FeedEpisodeSummary[] = [summary]) {
      TestBed.configureTestingModule({
        imports: [FolgeComponent],
        providers: [
          provideRouter([]),
          { provide: ActivatedRoute, useValue: { data: new BehaviorSubject({ episode: value }) } },
          { provide: FolgenService, useValue: { episodes: () => of(list) } }
        ]
      });
      const fixture = TestBed.createComponent(FolgeComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      return fixture.nativeElement as HTMLElement;
    }

    it('should show the episode with its show notes and where to listen', async () => {
      const root = await render(episode);

      expect(text(root, 'h1')).toBe('Die Wölfe von Morgen mit Johannes Meyer');
      expect(Array.from(root.querySelectorAll('ul[aria-label="Über die Folge"] li')).map(item => item.textContent!.trim())).toEqual(['S4 · 9', '07.11.2024', '52 Min.']);
      expect(root.querySelector('section[aria-label="Shownotes"] strong')?.textContent).toBe('Nachwuchsarbeit');
      expect(root.querySelector('section[aria-label="Shownotes"] li')?.textContent).toBe('Kapitel 1');
      expect(root.querySelector('a[href^="https://podcasters.spotify.com"]')?.textContent).toContain('Auf Spotify anhören');
    });

    it('should link to the episodes released before and after it', async () => {
      const newer = { ...summary, slug: 'neuere-folge', title: 'Neuere Folge', code: 'S4 · 10' };
      const older = { ...summary, slug: 'aeltere-folge', title: 'Ältere Folge', code: null };
      const root = await render(episode, [newer, summary, older]);
      const links = Array.from(root.querySelectorAll('nav[aria-label="Weitere Folgen"] a'))
        .map(link => [link.getAttribute('href'), link.textContent!.replace(/\s+/g, ' ').trim()]);

      expect(links).toEqual([
        ['/folgen/neuere-folge', 'Neuere Folge · S4 · 10 Neuere Folge'],
        ['/folgen/aeltere-folge', 'Ältere Folge Ältere Folge'],
        ['/folgen', 'Alle Folgen ansehen →']
      ]);
    });

    it('should strip scripts from the show notes', async () => {
      const root = await render(episode);

      expect(root.querySelector('section[aria-label="Shownotes"] script')).toBeNull();
    });

    it('should describe the episode as structured data while the page is open', async () => {
      await render(episode);
      const data = JSON.parse(document.getElementById('episode-structured-data')!.textContent!);

      expect(data['@graph'][0]).toEqual(jasmine.objectContaining({
        '@type': 'PodcastEpisode',
        url: 'https://schnittstellenpass.de/folgen/die-woelfe-von-morgen-mit-johannes-meyer',
        timeRequired: 'PT52M5S'
      }));

      TestBed.resetTestingModule();
      expect(document.getElementById('episode-structured-data')).toBeNull();
    });

    it('should say so for an unknown episode', async () => {
      const root = await render(null);

      expect(text(root, 'h1')).toBe('Folge nicht gefunden');
      expect(root.querySelector('a[href="/folgen"]')).not.toBeNull();
      expect(document.getElementById('episode-structured-data')).toBeNull();
    });
  });

  describe('FolgenArchiveComponent', () => {
    async function render(episodes: FeedEpisodeSummary[]) {
      TestBed.configureTestingModule({
        imports: [FolgenArchiveComponent],
        providers: [provideRouter([]), { provide: FolgenService, useValue: { episodes: () => of(episodes) } }]
      });
      const fixture = TestBed.createComponent(FolgenArchiveComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      return fixture.nativeElement as HTMLElement;
    }

    it('should link every episode to its page, with a play button to Spotify', async () => {
      const root = await render([summary, { ...summary, slug: 'zweite-folge', title: 'Zweite Folge' }]);
      const links = Array.from(root.querySelectorAll('ol a')).map(link => [link.getAttribute('href'), link.getAttribute('target')]);

      expect(links).toEqual([
        ['/folgen/die-woelfe-von-morgen-mit-johannes-meyer', null], [summary.listenUrl, '_blank'],
        ['/folgen/zweite-folge', null], [summary.listenUrl, '_blank']
      ]);
      expect(root.querySelector('ol a[target="_blank"] .sr-only')!.textContent!.trim()).toBe('Auf Spotify anhören: Die Wölfe von Morgen mit Johannes Meyer');
      expect(text(root, 'h1')).toBe('Alle Folgen');
      expect(text(root, 'ol h2')).toBe('Die Wölfe von Morgen mit Johannes Meyer');
    });

    it('should point to Spotify if the build had no episodes', async () => {
      const root = await render([]);

      expect(root.querySelector('ol')).toBeNull();
      expect(root.querySelector('a[href^="https://open.spotify.com/show/"]')).not.toBeNull();
    });
  });
});
