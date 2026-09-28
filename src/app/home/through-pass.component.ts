import { Component, DestroyRef, ElementRef, NgZone, afterNextRender, inject, input, viewChild } from '@angular/core';
import type { gsap as GsapApi } from 'gsap';

export interface Point {
  x: number;
  y: number;
}

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface PassLayout {
  // Path the ball rolls along
  path: string;
  passer: Point;
  receiver: Point;
  defenders: [Point, Point];
}

// The gap between the two blocks must be at least this wide for the pass
const MIN_GAP = 32;

/**
 * Plans a through pass ("Schnittstellenpass") through the gap between two
 * blocks of the hero: vertically between text and card when they sit side by
 * side, horizontally when they are stacked. Coordinates are relative to the
 * area of the given size; null if there is no usable gap.
 */
export function planThroughPass(first: Box, second: Box, width: number, height: number): PassLayout | null {
  const firstRight = first.left + first.width;
  const firstBottom = first.top + first.height;
  const secondBottom = second.top + second.height;

  // Side by side: the ball comes in along the bottom and runs up the gap
  if (second.left - firstRight >= MIN_GAP) {
    const gapX = (firstRight + second.left) / 2;
    const spread = Math.min(28, (second.left - firstRight) / 2 - 8);
    const top = Math.max(first.top, second.top);
    const bottom = Math.min(firstBottom, secondBottom);
    const receiver = { x: gapX, y: top + 18 };
    const end = receiver.y + 24;
    const stripTop = Math.max(firstBottom, secondBottom);
    const middle = (top + bottom) / 2;
    const defenders: [Point, Point] = [{ x: gapX - spread, y: middle }, { x: gapX + spread, y: middle }];
    if (height - stripTop >= 28) {
      const lane = (stripTop + height) / 2;
      const passer = { x: first.left + 12, y: lane };
      const bend = lane - Math.min(160, (lane - end) / 2);
      return {
        path: `M${passer.x + 22} ${lane}C${gapX} ${lane} ${gapX} ${lane} ${gapX} ${bend}L${gapX} ${end}`,
        passer,
        receiver,
        defenders
      };
    }
    const passer = { x: gapX, y: bottom - 12 };
    return { path: `M${gapX} ${passer.y - 22}L${gapX} ${end}`, passer, receiver, defenders };
  }

  // Stacked: the ball runs across the gap from left to right
  if (second.top - firstBottom >= MIN_GAP) {
    const gapY = (firstBottom + second.top) / 2;
    const spread = Math.min(28, (second.top - firstBottom) / 2 - 7);
    const passer = { x: first.left + 12, y: gapY };
    const receiver = { x: Math.min(width - 24, firstRight - 12), y: gapY };
    const middle = (passer.x + receiver.x) / 2;
    return {
      path: `M${passer.x + 22} ${gapY}L${receiver.x - 24} ${gapY}`,
      passer,
      receiver,
      defenders: [{ x: middle, y: gapY - spread }, { x: middle, y: gapY + spread }]
    };
  }

  return null;
}

/**
 * Position of an element within one of its positioned ancestors, ignoring
 * transforms (the reveal animation shifts elements while they fade in)
 */
function boxWithin(element: HTMLElement, ancestor: HTMLElement): Box {
  let left = 0;
  let top = 0;
  let current: HTMLElement | null = element;
  while (current && current !== ancestor) {
    left += current.offsetLeft;
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  return { left, top, width: element.offsetWidth, height: element.offsetHeight };
}

let nextId = 0;
const BALL_RADIUS = 10;

/**
 * Decorative tactics-board animation for the hero: a through pass that splits
 * two defenders in the gap between the `first` and `second` element. GSAP is
 * loaded only after the page has rendered. Everything runs outside the Angular
 * zone, so the endless animation never keeps the app from becoming stable.
 * With reduced motion the finished move is shown as a still image.
 */
@Component({
  selector: 'app-through-pass',
  host: { class: 'pointer-events-none absolute inset-0', 'aria-hidden': 'true' },
  template: `
    <svg #svg class="absolute inset-0 size-full opacity-0" focusable="false">
      <defs>
        <mask [id]="maskId" maskUnits="userSpaceOnUse">
          <path #reveal fill="none" stroke="white" stroke-width="12" stroke-linecap="round" />
        </mask>
      </defs>
      <path #trail fill="none" class="stroke-ink/50" stroke-width="3" stroke-linecap="round" stroke-dasharray="0.1 9" [attr.mask]="'url(#' + maskId + ')'" />
      <g #passer><circle data-pop r="9" class="fill-none stroke-ink/70" stroke-width="2" /></g>
      <g #receiver>
        <circle #pulse r="9" class="fill-none stroke-ink" stroke-width="2" opacity="0" />
        <circle data-pop r="9" class="fill-none stroke-ink/70" stroke-width="2" />
      </g>
      <g #defenderA><path data-pop data-defender d="M-6 -6L6 6M6 -6L-6 6" class="stroke-signal" stroke-width="3" stroke-linecap="round" /></g>
      <g #defenderB><path data-pop data-defender d="M-6 -6L6 6M6 -6L-6 6" class="stroke-signal" stroke-width="3" stroke-linecap="round" /></g>
      <g #ball>
        <g #spin>
          <circle [attr.r]="ballRadius" class="fill-paper stroke-ink" stroke-width="2" />
          <path d="M0 -4.2L4 -1.3L2.5 3.4L-2.5 3.4L-4 -1.3Z" class="fill-ink" />
          <path d="M0 -4.2V-9M4 -1.3L8.6 -2.8M2.5 3.4L5.3 7.3M-2.5 3.4L-5.3 7.3M-4 -1.3L-8.6 -2.8" class="stroke-ink" stroke-width="1.5" />
        </g>
      </g>
    </svg>
  `
})
export class ThroughPassComponent {
  readonly first = input.required<HTMLElement>();
  readonly second = input.required<HTMLElement>();

  protected readonly maskId = `through-pass-${nextId++}`;
  protected readonly ballRadius = BALL_RADIUS;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly zone = inject(NgZone);
  private readonly svg = viewChild.required<ElementRef<SVGSVGElement>>('svg');
  private readonly reveal = viewChild.required<ElementRef<SVGPathElement>>('reveal');
  private readonly trail = viewChild.required<ElementRef<SVGPathElement>>('trail');
  private readonly passer = viewChild.required<ElementRef<SVGGElement>>('passer');
  private readonly receiver = viewChild.required<ElementRef<SVGGElement>>('receiver');
  private readonly pulse = viewChild.required<ElementRef<SVGCircleElement>>('pulse');
  private readonly defenderA = viewChild.required<ElementRef<SVGGElement>>('defenderA');
  private readonly defenderB = viewChild.required<ElementRef<SVGGElement>>('defenderB');
  private readonly ball = viewChild.required<ElementRef<SVGGElement>>('ball');
  private readonly spin = viewChild.required<ElementRef<SVGGElement>>('spin');

  private gsap: typeof GsapApi | null = null;
  private timeline: gsap.core.Timeline | null = null;
  private currentPath = '';
  private inView = false;
  private destroyed = false;
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private pendingFrame = 0;

  constructor() {
    afterNextRender(() => this.zone.runOutsideAngular(() => this.start()));
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      cancelAnimationFrame(this.pendingFrame);
      this.resizeObserver?.disconnect();
      this.intersectionObserver?.disconnect();
      this.timeline?.kill();
    });
  }

  private async start(): Promise<void> {
    const { gsap } = await import('gsap');
    if (this.destroyed) {
      return;
    }
    this.gsap = gsap;
    this.build();

    const schedule = () => {
      cancelAnimationFrame(this.pendingFrame);
      this.pendingFrame = requestAnimationFrame(() => this.build());
    };
    this.resizeObserver = new ResizeObserver(schedule);
    for (const element of [this.host, this.first(), this.second()]) {
      this.resizeObserver.observe(element);
    }
    // Only animate while the hero is on screen
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.inView = entry.isIntersecting;
      this.playOrPause();
    });
    this.intersectionObserver.observe(this.host);
  }

  private build(): void {
    const ancestor = this.host.offsetParent as HTMLElement | null;
    const layout = ancestor && planThroughPass(
      boxWithin(this.first(), ancestor),
      boxWithin(this.second(), ancestor),
      this.host.clientWidth,
      this.host.clientHeight
    );
    if (layout?.path === this.currentPath && this.timeline) {
      return;
    }
    this.timeline?.kill();
    this.timeline = null;
    this.currentPath = layout?.path ?? '';
    this.svg().nativeElement.style.opacity = '0';
    if (!layout || !this.gsap) {
      return;
    }

    const place = (group: ElementRef<SVGGElement>, point: Point) => group.nativeElement.setAttribute('transform', `translate(${point.x} ${point.y})`);
    place(this.passer(), layout.passer);
    place(this.receiver(), layout.receiver);
    place(this.defenderA(), layout.defenders[0]);
    place(this.defenderB(), layout.defenders[1]);
    for (const path of [this.trail(), this.reveal()]) {
      path.nativeElement.setAttribute('d', layout.path);
    }
    this.timeline = this.createTimeline(this.gsap, layout);
    this.svg().nativeElement.style.opacity = '1';

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Jump to the finished move with callbacks, so the ball is drawn at its end position
      this.timeline.seek('scored', false).pause();
    } else {
      this.playOrPause();
    }
  }

  private createTimeline(gsap: typeof GsapApi, layout: PassLayout): gsap.core.Timeline {
    const path = this.trail().nativeElement;
    const reveal = this.reveal().nativeElement;
    const ball = this.ball().nativeElement;
    const spin = this.spin().nativeElement;
    const length = path.getTotalLength();
    const markers = this.svg().nativeElement.querySelectorAll('[data-pop]');
    const defenders = this.svg().nativeElement.querySelectorAll('[data-defender]');
    const everything = [...Array.from(markers), path, ball];

    reveal.style.strokeDasharray = `${length}`;
    reveal.style.strokeDashoffset = `${length}`;
    const roll = { progress: 0 };
    const render = () => {
      const distance = length * roll.progress;
      const point = path.getPointAtLength(distance);
      ball.setAttribute('transform', `translate(${point.x} ${point.y})`);
      spin.setAttribute('transform', `rotate(${(distance / (2 * Math.PI * BALL_RADIUS)) * 360})`);
      reveal.style.strokeDashoffset = `${length - distance}`;
    };

    // The defenders only react once the ball is already through
    const passDuration = 1.9;
    const reactAt = passDuration * (1 - Math.sqrt(0.45));
    const [left, right] = layout.defenders;
    const closeIn = (right.x - left.x) * 0.3;
    const closeInY = (right.y - left.y) * 0.3;

    return gsap.timeline({ repeat: -1, repeatDelay: 1.2, paused: true, onRepeat: render })
      .set(roll, { progress: 0, onComplete: render })
      .set(everything, { opacity: 1 })
      .set(defenders, { x: 0, y: 0 })
      .fromTo(markers, { scale: 0 }, { scale: 1, transformOrigin: '50% 50%', duration: 0.4, ease: 'back.out(2.5)', stagger: 0.08 })
      .fromTo(ball, { opacity: 0 }, { opacity: 1, duration: 0.2 }, '-=0.1')
      .addLabel('pass', '+=0.25')
      .to(roll, { progress: 1, duration: passDuration, ease: 'power2.out', onUpdate: render }, 'pass')
      .to(defenders[0], { x: closeIn, y: closeInY, duration: 0.5, ease: 'power2.out' }, `pass+=${reactAt}`)
      .to(defenders[1], { x: -closeIn, y: -closeInY, duration: 0.5, ease: 'power2.out' }, `pass+=${reactAt}`)
      .addLabel('scored', `pass+=${passDuration}`)
      .fromTo(this.pulse().nativeElement, { scale: 1, opacity: 0.8 }, { scale: 2.6, opacity: 0, transformOrigin: '50% 50%', duration: 0.8, ease: 'power1.out' }, 'scored-=0.4')
      .to(everything, { opacity: 0, duration: 0.5 }, 'scored+=2.4');
  }

  private playOrPause(): void {
    if (!this.timeline || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    if (this.inView) {
      this.timeline.play();
    } else {
      this.timeline.pause();
    }
  }
}
