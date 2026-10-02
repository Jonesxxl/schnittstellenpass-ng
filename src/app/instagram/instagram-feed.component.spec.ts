import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { Observable, Subject, of } from 'rxjs';
import { InstagramFeedComponent, SLIDE_DURATION } from './instagram-feed.component';
import { chipLabel, headlineCaption, shorten } from './instagram-caption';
import { InstagramFeedService, InstagramPost } from '../services/instagram-feed.service';

describe('InstagramFeedComponent', () => {
  const post = (id: string, caption = `Beitrag ${id}`, mediaType: InstagramPost['mediaType'] = 'IMAGE'): InstagramPost => ({
    id,
    permalink: `https://www.instagram.com/p/${id}/`,
    caption,
    mediaType,
    timestamp: '2026-09-20T18:00:00+0000',
    image: `/.netlify/functions/instagram?image=${id}`
  });
  const fourPosts = ['1', '2', '3', '4'].map(id => post(id));

  let fixture: ComponentFixture<InstagramFeedComponent>;

  function render(posts: Observable<InstagramPost[]>): HTMLElement {
    TestBed.configureTestingModule({
      imports: [InstagramFeedComponent],
      providers: [{ provide: InstagramFeedService, useValue: { getLatestPosts: () => posts } }]
    });
    fixture = TestBed.createComponent(InstagramFeedComponent);
    // First pass renders and starts the carousel (afterNextRender), the second one runs the timer effect
    fixture.detectChanges();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  // Stops the carousel timer and drains the change detection timers fakeAsync would complain about
  function finish(): void {
    fixture.destroy();
    flush();
  }

  const active = () => fixture.componentInstance.active();
  const rows = (root: HTMLElement) => Array.from(root.querySelectorAll<HTMLButtonElement>('button[aria-pressed]'));
  const module = (root: HTMLElement) => root.querySelector<HTMLElement>('[aria-busy]')!;
  const text = (element: Element | null) => element?.textContent?.replace(/\s+/g, ' ').trim();

  it('should advance to the next post every 5 seconds and wrap around', fakeAsync(() => {
    const root = render(of(fourPosts));
    expect(active()).toBe(0);

    tick(SLIDE_DURATION - 1);
    expect(active()).toBe(0);
    tick(1);
    expect(active()).toBe(1);

    tick(SLIDE_DURATION * 3);
    fixture.detectChanges();
    expect(active()).toBe(0);
    expect(rows(root)[0].getAttribute('aria-pressed')).toBe('true');
    expect(fixture.componentInstance.cycle()).toBe(4);
    finish();
  }));

  it('should activate a post on click and restart the interval', fakeAsync(() => {
    const root = render(of(fourPosts));
    tick(3000);

    rows(root)[2].click();
    fixture.detectChanges();
    expect(active()).toBe(2);
    expect(rows(root).map(row => row.getAttribute('aria-pressed'))).toEqual(['false', 'false', 'true', 'false']);
    expect(root.querySelector('#kabine-stage')!.getAttribute('href')).toBe('https://www.instagram.com/p/3/');
    expect(text(root.querySelector('#kabine-stage .line-clamp-3'))).toBe('Beitrag 3');

    tick(SLIDE_DURATION - 1);
    expect(active()).toBe(2);
    tick(1);
    expect(active()).toBe(3);
    finish();
  }));

  it('should not advance while hovered and continue with the remaining time afterwards', fakeAsync(() => {
    const root = render(of(fourPosts));
    tick(2000);

    module(root).dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(fixture.componentInstance.paused()).toBeTrue();
    expect(root.querySelector<HTMLElement>('.animate-fillbar')!.style.animationPlayState).toBe('paused');
    tick(SLIDE_DURATION * 4);
    expect(active()).toBe(0);

    module(root).dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    tick(SLIDE_DURATION - 2000 - 1);
    expect(active()).toBe(0);
    tick(1);
    expect(active()).toBe(1);
    finish();
  }));

  it('should not advance while a row has keyboard focus and move with the arrow keys', fakeAsync(() => {
    const root = render(of(fourPosts));
    const [first] = rows(root);

    first.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    fixture.detectChanges();
    expect(active()).toBe(3);

    rows(root)[3].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(active()).toBe(0);

    tick(SLIDE_DURATION * 2);
    expect(active()).toBe(0);
    finish();
  }));

  it('should not advance automatically if the user prefers reduced motion', fakeAsync(() => {
    spyOn(window, 'matchMedia').and.returnValue({
      matches: true,
      addEventListener: () => undefined,
      removeEventListener: () => undefined
    } as unknown as MediaQueryList);
    render(of(fourPosts));

    tick(SLIDE_DURATION * 3);
    expect(active()).toBe(0);
    finish();
  }));

  it('should load only the first picture eagerly and describe each picture by its caption', fakeAsync(() => {
    const root = render(of([post('1', 'Neue Folge ist online. Jetzt reinhören #podcast'), post('2', '', 'VIDEO')]));
    const images = Array.from(root.querySelectorAll('img'));

    expect(images.map(image => image.getAttribute('src'))).toEqual(['/.netlify/functions/instagram?image=1', '/.netlify/functions/instagram?image=2']);
    expect(images[0].getAttribute('fetchpriority')).toBe('high');
    expect(images[0].hasAttribute('loading')).toBeFalse();
    expect(images[1].getAttribute('loading')).toBe('lazy');
    expect(images[0].getAttribute('alt')).toBe('Neue Folge ist online');
    expect(images[1].getAttribute('alt')).toBe('Instagram-Beitrag von Schnittstellenpass');
    finish();
  }));

  it('should reduce progress bars and rows to the number of posts', fakeAsync(() => {
    const root = render(of([post('1'), post('2')]));

    expect(rows(root).length).toBe(2);
    expect(root.querySelectorAll('#kabine-stage [aria-hidden="true"] > span').length).toBe(2);
    expect(root.textContent).toContain('01 / 02');
    finish();
  }));

  it('should show placeholders in the same layout while loading', fakeAsync(() => {
    const root = render(new Subject<InstagramPost[]>());

    expect(module(root).getAttribute('aria-busy')).toBe('true');
    expect(root.querySelectorAll('.grid[aria-hidden="true"]').length).toBe(4);
    expect(rows(root).length).toBe(0);
    expect(root.querySelector('a[href="https://www.instagram.com/schnittstellenpass/"]')).not.toBeNull();
    finish();
  }));

  it('should link to Instagram if the feed has no posts', fakeAsync(() => {
    const root = render(of([]));

    expect(module(root).getAttribute('aria-busy')).toBe('false');
    expect(root.textContent).toContain('Feed gerade im Abseits');
    expect(text(root.querySelector('a[href="https://www.instagram.com/schnittstellenpass/"]'))).toBe('Direkt auf Instagram →');
    expect(rows(root).length).toBe(0);
    finish();
  }));
});

describe('Instagram captions', () => {
  it('should map the media type to a chip label', () => {
    expect(chipLabel({ mediaType: 'VIDEO', caption: 'Clip aus der Folge' })).toBe('Reel');
    expect(chipLabel({ mediaType: 'CAROUSEL_ALBUM', caption: 'Bilder vom Training' })).toBe('Galerie');
    expect(chipLabel({ mediaType: 'IMAGE', caption: 'Neue Folge' })).toBe('Post');
  });

  it('should mark posts about a live event regardless of the media type', () => {
    expect(chipLabel({ mediaType: 'VIDEO', caption: 'Heute LIVE im Vereinsheim' })).toBe('● Live');
    expect(chipLabel({ mediaType: 'IMAGE', caption: 'Die Live-Folge ist online' })).toBe('● Live');
    expect(chipLabel({ mediaType: 'IMAGE', caption: 'Zu Gast: Oliver aus Liverpool' })).toBe('Post');
  });

  it('should use the first sentence without hashtags and emoji', () => {
    expect(headlineCaption('🎙️ Neue Folge ist online! Jetzt überall hören #podcast #fußball')).toBe('Neue Folge ist online!');
    expect(headlineCaption('Zu Gast beim 1. FC Köln 🇩🇪. Mehr in der Folge')).toBe('Zu Gast beim 1. FC Köln');
    expect(headlineCaption('Erste Zeile\nZweite Zeile')).toBe('Erste Zeile');
    expect(headlineCaption('#tbt 👍')).toBe('');
  });

  it('should shorten long captions at a word boundary', () => {
    expect(shorten('Kurz')).toBe('Kurz');
    const short = shorten('Zwischen Profi und Amateur: wie der Sprung aus der Kreisliga in den Leistungsbereich gelingt');
    expect(Array.from(short).length).toBeLessThanOrEqual(60);
    expect(short).toBe('Zwischen Profi und Amateur: wie der Sprung aus der…');
  });
});
