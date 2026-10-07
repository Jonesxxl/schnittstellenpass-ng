import { Component, DOCUMENT, DestroyRef, PLATFORM_ID, ElementRef, afterNextRender, computed, effect, inject, input, signal, viewChildren } from '@angular/core';
import { NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { InstagramFeedService } from '../services/instagram-feed.service';
import { LINKS } from '../shared/links';
import { chipLabel, headlineCaption, shorten } from './instagram-caption';

/** Time each post stays on stage; must match the fillbar animation in tailwind.config.js */
export const SLIDE_DURATION = 5000;

const SLIDE_COUNT = 4;

interface Slide {
  id: string;
  permalink: string;
  image: string;
  chip: string;
  caption: string;
  short: string;
}

/**
 * "Aus der Kabine": ticker band, section header and the latest Instagram posts
 * as a stadium-programme carousel (stage on the left, numbered list on the right)
 */
@Component({
  selector: 'app-instagram-feed',
  imports: [NgTemplateOutlet],
  host: { class: 'block' },
  templateUrl: './instagram-feed.component.html'
})
export class InstagramFeedComponent {
  private readonly instagramFeedService = inject(InstagramFeedService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  readonly eyebrow = input('Instagram');
  readonly headline = input('Aus der Kabine');

  protected readonly links = LINKS;
  protected readonly placeholderRows = Array.from({ length: SLIDE_COUNT }, (_, i) => i);
  protected readonly tickerItems = [
    'Neue Folge alle 14 Tage',
    'Clips aus der Kabine',
    'Jetzt auch live',
    'Zwischen Profi & Amateur',
    '@schnittstellenpass'
  ];

  // Loaded in the browser only, like the Spotify episodes (see HomeComponent)
  private readonly feed = rxResource({
    params: () => isPlatformBrowser(this.platformId) || undefined,
    stream: () => this.instagramFeedService.getLatestPosts()
  });

  protected readonly loading = computed(() => this.feed.status() === 'idle' || this.feed.isLoading());

  protected readonly slides = computed<Slide[]>(() =>
    (this.feed.hasValue() ? this.feed.value() : []).slice(0, SLIDE_COUNT).map(post => {
      const caption = headlineCaption(post.caption);
      return {
        id: post.id,
        permalink: post.permalink,
        image: post.image,
        chip: chipLabel(post),
        caption: caption || 'Auf Instagram ansehen',
        short: caption ? shorten(caption) : 'Instagram-Beitrag von Schnittstellenpass'
      };
    })
  );

  readonly active = signal(0);
  // Hover or keyboard focus on the module (temporary)
  readonly paused = signal(false);
  // Stopped with the pause button; also holds the ticker band
  readonly stopped = signal(false);
  // Increased on every change; used as track key so the CSS animations start over
  readonly cycle = signal(0);
  // Single-item list keyed by cycle: the progress bars and the caption are re-created on every change
  protected readonly runs = computed(() => [{ id: this.cycle() }]);

  private readonly started = signal(false);
  private readonly hidden = signal(false);
  protected readonly reducedMotion = signal(false);

  protected readonly current = computed(() => this.slides()[this.active()]);
  protected readonly holdProgress = computed(() => this.paused() || this.stopped() || this.hidden());
  protected readonly running = computed(() =>
    this.started() && !this.holdProgress() && !this.reducedMotion() && this.slides().length > 1
  );

  private readonly rows = viewChildren<ElementRef<HTMLButtonElement>>('row');

  private timer?: ReturnType<typeof setTimeout>;
  private timerStartedAt = 0;
  // Time left for the current post; kept across a pause so stage and progress bars stay in sync
  private remaining = SLIDE_DURATION;
  private hovered = false;
  private focused = false;

  constructor() {
    effect(() => (this.running() ? this.resumeTimer() : this.stopTimer()));

    // Browser only: start the carousel once rendered, pause it in background tabs
    afterNextRender(() => {
      const motion = this.document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)');
      const onMotionChange = () => this.reducedMotion.set(!!motion?.matches);
      const onVisibilityChange = () => this.hidden.set(this.document.hidden);

      onMotionChange();
      onVisibilityChange();
      motion?.addEventListener('change', onMotionChange);
      this.document.addEventListener('visibilitychange', onVisibilityChange);
      this.started.set(true);

      this.destroyRef.onDestroy(() => {
        motion?.removeEventListener('change', onMotionChange);
        this.document.removeEventListener('visibilitychange', onVisibilityChange);
      });
    });

    this.destroyRef.onDestroy(() => clearTimeout(this.timer));
  }

  /** Puts a post on stage and restarts its full display time */
  select(index: number): void {
    this.active.set(index);
    this.cycle.update(cycle => cycle + 1);
    this.remaining = SLIDE_DURATION;
    if (this.timer) {
      this.startTimer();
    }
  }

  /**
   * Pause button for carousel and ticker. Continuing is an explicit request,
   * so it also lifts the pause from hovering or focusing the module
   */
  toggleMotion(): void {
    const stop = !this.stopped();
    this.stopped.set(stop);
    if (!stop) {
      this.hovered = false;
      this.focused = false;
      this.paused.set(false);
    }
  }

  protected pad(value: number): string {
    return String(value).padStart(2, '0');
  }

  protected onPointer(inside: boolean): void {
    this.hovered = inside;
    this.paused.set(this.hovered || this.focused);
  }

  protected onFocusOut(event: FocusEvent): void {
    const module = event.currentTarget as HTMLElement;
    this.onFocus(module.contains(event.relatedTarget as Node | null));
  }

  protected onFocus(inside: boolean): void {
    this.focused = inside;
    this.paused.set(this.hovered || this.focused);
  }

  /** Arrow keys move through the list, Home/End jump to the first/last post */
  protected onListKeydown(event: KeyboardEvent): void {
    const count = this.slides().length;
    const rows = this.rows().map(row => row.nativeElement);
    const from = Math.max(rows.indexOf(event.target as HTMLButtonElement), 0);
    const target =
      event.key === 'ArrowDown' ? (from + 1) % count :
      event.key === 'ArrowUp' ? (from - 1 + count) % count :
      event.key === 'Home' ? 0 :
      event.key === 'End' ? count - 1 :
      -1;
    if (target < 0 || !count) {
      return;
    }
    event.preventDefault();
    this.select(target);
    rows[target]?.focus();
  }

  private advance(): void {
    this.timer = undefined;
    this.select((this.active() + 1) % this.slides().length);
    this.startTimer();
  }

  private startTimer(delay = SLIDE_DURATION): void {
    clearTimeout(this.timer);
    this.remaining = delay;
    this.timerStartedAt = Date.now();
    this.timer = setTimeout(() => this.advance(), delay);
  }

  private resumeTimer(): void {
    if (!this.timer) {
      this.startTimer(this.remaining);
    }
  }

  private stopTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
      this.remaining = Math.max(0, this.remaining - (Date.now() - this.timerStartedAt));
    }
  }
}
