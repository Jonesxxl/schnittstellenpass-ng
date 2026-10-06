import { Component, DestroyRef, ElementRef, afterNextRender, computed, inject, input, signal } from '@angular/core';
import { AboutFact } from '../services/content.service';

/** Lets the column fade in first (appReveal on the parent) */
const START_DELAY = 300;
/** Time one number needs to count up */
const COUNT_DURATION = 1100;
/** Delay between the columns; must match the delays of flipin and drawline below */
const STAGGER = 160;

interface BoardFact {
  value: string;
  label: string;
  // Leading number that counts up ("45" of "45 min"); null for text like "Live"
  target: number | null;
  rest: string;
  live: boolean;
}

/**
 * Facts about the podcast as a stadium scoreboard. When it scrolls into view,
 * numbers count up, text flips in and a line is drawn under each column.
 * Without IntersectionObserver or with reduced motion the final values are
 * shown right away; screen readers always get the final values.
 */
@Component({
  selector: 'app-fact-board',
  host: { class: 'block' },
  template: `
    <div class="relative overflow-hidden rounded-md border-2 border-ink bg-ink text-paper shadow-[8px_8px_0_#3F6B45]">
      <!-- Mowing stripes of a freshly cut pitch -->
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,rgb(207_227_196/.035)_0_56px,transparent_56px_112px)]"></div>
      <div class="relative flex items-center justify-between gap-3 border-b-2 border-paper/10 px-3 py-2 font-mono text-[11px] uppercase tracking-[.14em] text-pitch sm:px-4">
        <span>Der Podcast in Zahlen</span>
        <svg aria-hidden="true" viewBox="0 0 30 20" class="h-3.5 w-auto shrink-0" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x=".75" y=".75" width="28.5" height="18.5" rx="1" />
          <path d="M15 .75v18.5M.75 6.5h4v7h-4M29.25 6.5h-4v7h4" />
          <circle cx="15" cy="10" r="3.5" />
        </svg>
      </div>
      <dl class="relative m-0 grid grid-cols-3 divide-x-2 divide-paper/10">
        @for (item of items(); track $index) {
          <div class="relative flex min-w-0 flex-col-reverse justify-end gap-1 px-3 pb-4 pt-3 sm:px-4 sm:pt-4">
            <dt class="font-mono text-[10px] uppercase leading-snug tracking-[.08em] text-chalk/75 sm:text-[11px]">{{ item.label }}</dt>
            <dd class="m-0 flex items-center gap-2 overflow-hidden pb-[.12em] font-display text-[clamp(21px,6.5vw,26px)] font-black leading-none text-pitch sm:text-[clamp(26px,3vw,40px)]">
              <span class="sr-only">{{ item.value }}</span>
              <span
                aria-hidden="true"
                class="block whitespace-nowrap tabular-nums"
                [class.animate-flipin]="armed() && item.target === null"
                [style.animation-delay.ms]="startDelay + $index * stagger"
                [style.animation-play-state]="started() ? 'running' : 'paused'"
              >{{ shown()[$index] }}</span>
              @if (item.live) {
                <span aria-hidden="true" class="size-2 shrink-0 rounded-full bg-signal motion-safe:animate-livepulse sm:size-2.5"></span>
              }
            </dd>
            <span
              aria-hidden="true"
              class="absolute bottom-0 left-3 right-3 h-[3px] origin-left bg-pitch sm:left-4 sm:right-4"
              [class.animate-drawline]="armed()"
              [style.animation-delay.ms]="startDelay + $index * stagger + 200"
              [style.animation-play-state]="started() ? 'running' : 'paused'"
            ></span>
          </div>
        }
      </dl>
    </div>
  `
})
export class FactBoardComponent {
  readonly facts = input.required<AboutFact[]>();

  protected readonly startDelay = START_DELAY;
  protected readonly stagger = STAGGER;

  protected readonly items = computed<BoardFact[]>(() => this.facts().map(fact => {
    const match = /^(\d{1,4})(\D.*)?$/s.exec(fact.value);
    return {
      value: fact.value,
      label: fact.label,
      target: match ? Number(match[1]) : null,
      rest: match?.[2] ?? '',
      live: /\blive\b/i.test(fact.value)
    };
  }));

  // The animation will run: values wait at their start until the board is in view
  protected readonly armed = signal(false);
  protected readonly started = signal(false);
  // Milliseconds since the start of the count-up
  private readonly elapsed = signal(0);
  private frame = 0;

  protected readonly shown = computed(() => this.items().map((item, index) => {
    if (!this.armed() || item.target === null) {
      return item.value;
    }
    const progress = Math.min(Math.max((this.elapsed() - index * STAGGER) / COUNT_DURATION, 0), 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    return `${Math.round(item.target * eased)}${item.rest}`;
  }));

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      this.armed.set(true);
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          observer.disconnect();
          this.start();
        }
      }, { threshold: 0.6 });
      observer.observe(host);
      destroyRef.onDestroy(() => {
        observer.disconnect();
        cancelAnimationFrame(this.frame);
      });
    });
  }

  private start(): void {
    this.started.set(true);
    const end = (this.items().length - 1) * STAGGER + COUNT_DURATION;
    const begin = performance.now() + START_DELAY;
    const tick = (now: number) => {
      this.elapsed.set(now - begin);
      if (now - begin < end) {
        this.frame = requestAnimationFrame(tick);
      }
    };
    this.frame = requestAnimationFrame(tick);
  }
}
