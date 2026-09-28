import { Component, DestroyRef, ElementRef, NgZone, afterNextRender, inject, input, viewChild } from '@angular/core';
import type { gsap as GsapApi } from 'gsap';
import { Box, Frame, PassScene, ballPentagons, createPassScene, planThroughPass, rotate } from './through-pass.scene';

interface Kit {
  shirt: string;
  socks: string;
  skin: string;
  hair: string;
}

// Passer, receiver, left defender, right defender
const KITS: Kit[] = [
  { shirt: '#16261B', socks: '#16261B', skin: '#8D5A3B', hair: '#15100C' },
  { shirt: '#16261B', socks: '#16261B', skin: '#E0B48F', hair: '#4A3222' },
  { shirt: '#E0492F', socks: '#F3EFE2', skin: '#C68B5E', hair: '#15100C' },
  { shirt: '#E0492F', socks: '#F3EFE2', skin: '#EBC3A0', hair: '#7A5634' }
];

const PENTAGONS = ballPentagons();

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

/**
 * Decorative animation for the hero, seen from above like a tactics camera: a
 * through pass that splits two defenders in the gap between the `first` and
 * `second` element (choreography in through-pass.scene.ts). GSAP is loaded only
 * after the page has rendered and drives the clock. Everything runs outside
 * the Angular zone, so the endless animation never keeps the app from becoming
 * stable. With reduced motion the moment of the reception is shown as a still.
 */
@Component({
  selector: 'app-through-pass',
  host: { class: 'pointer-events-none absolute inset-0', 'aria-hidden': 'true' },
  template: `
    <svg class="absolute inset-0 size-full" focusable="false">
      <defs>
        <radialGradient [id]="id + '-shadow'">
          <stop offset="0.3" stop-color="#16261B" stop-opacity="0.3" />
          <stop offset="1" stop-color="#16261B" stop-opacity="0" />
        </radialGradient>
        <radialGradient [id]="id + '-shade'" cx="0.36" cy="0.32" r="0.8">
          <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.35" />
          <stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0" />
          <stop offset="1" stop-color="#000000" stop-opacity="0.3" />
        </radialGradient>
        <radialGradient [id]="id + '-ball'" cx="0.36" cy="0.32" r="0.8">
          <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.9" />
          <stop offset="0.45" stop-color="#FFFFFF" stop-opacity="0" />
          <stop offset="1" stop-color="#16261B" stop-opacity="0.5" />
        </radialGradient>
      </defs>
      <g #stage opacity="0">
        @for (kit of kits; track $index) {
          <ellipse data-shadow rx="11" ry="16" [attr.fill]="'url(#' + id + '-shadow)'" />
        }
        <ellipse #ballShadow rx="1.2" ry="1.05" [attr.fill]="'url(#' + id + '-shadow)'" />
        <g #ball>
          <circle r="1" fill="#FAF8F1" />
          @for (pentagon of pentagons; track $index) {
            <path data-pentagon fill="#16261B" />
          }
          <circle r="1" [attr.fill]="'url(#' + id + '-ball)'" />
          <circle r="1" fill="none" stroke="#16261B" stroke-opacity="0.5" stroke-width="0.12" />
        </g>
        @for (kit of kits; track $index) {
          <g data-player>
            <g data-leg>
              <rect x="-3.6" y="-6.8" width="7.2" height="4.6" rx="2.3" [attr.fill]="kit.socks" />
              <ellipse cx="3.8" cy="-4.5" rx="2.5" ry="1.9" fill="#101010" />
            </g>
            <g data-leg>
              <rect x="-3.6" y="2.2" width="7.2" height="4.6" rx="2.3" [attr.fill]="kit.socks" />
              <ellipse cx="3.8" cy="4.5" rx="2.5" ry="1.9" fill="#101010" />
            </g>
            <ellipse data-arm cy="-12.6" rx="3.4" ry="2.6" [attr.fill]="kit.skin" />
            <ellipse data-arm cy="12.6" rx="3.4" ry="2.6" [attr.fill]="kit.skin" />
            <ellipse rx="6.8" ry="12.4" [attr.fill]="kit.shirt" />
            <ellipse rx="6.8" ry="12.4" [attr.fill]="'url(#' + id + '-shade)'" />
            <circle cx="1.2" r="5.1" [attr.fill]="kit.skin" />
            <circle cx="-0.5" r="4.7" [attr.fill]="kit.hair" />
            <circle cx="0.6" r="5.1" [attr.fill]="'url(#' + id + '-shade)'" />
          </g>
        }
      </g>
    </svg>
  `
})
export class ThroughPassComponent {
  readonly first = input.required<HTMLElement>();
  readonly second = input.required<HTMLElement>();

  protected readonly id = `through-pass-${nextId++}`;
  protected readonly kits = KITS;
  protected readonly pentagons = PENTAGONS;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly zone = inject(NgZone);
  private readonly stage = viewChild.required<ElementRef<SVGGElement>>('stage');
  private readonly ball = viewChild.required<ElementRef<SVGGElement>>('ball');
  private readonly ballShadow = viewChild.required<ElementRef<SVGEllipseElement>>('ballShadow');

  private gsap: typeof GsapApi | null = null;
  private timeline: gsap.core.Timeline | null = null;
  private layoutKey = '';
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
    const key = JSON.stringify(layout);
    if (key === this.layoutKey && this.timeline) {
      return;
    }
    this.layoutKey = key;
    this.timeline?.kill();
    this.timeline = null;
    this.stage().nativeElement.setAttribute('opacity', '0');
    if (!layout || !this.gsap) {
      return;
    }

    const scene = createPassScene(layout);
    const draw = this.drawer(scene);
    const clock = { time: 0 };
    this.timeline = this.gsap.timeline({ repeat: -1, repeatDelay: 0.6, paused: true })
      .to(clock, { time: scene.duration, duration: scene.duration, ease: 'none', onUpdate: () => draw(scene.frame(clock.time)) });

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const still = scene.frame(scene.receptionTime + 0.4);
      draw({ ...still, opacity: 1 });
    } else {
      draw(scene.frame(0));
      this.playOrPause();
    }
  }

  /**
   * Returns a function that renders one frame of the scene into the SVG
   */
  private drawer(scene: PassScene): (frame: Frame) => void {
    const stage = this.stage().nativeElement;
    const players = Array.from(stage.querySelectorAll<SVGGElement>('[data-player]')).map(player => ({
      root: player,
      legs: player.querySelectorAll<SVGGElement>('[data-leg]'),
      arms: player.querySelectorAll<SVGEllipseElement>('[data-arm]')
    }));
    const shadows = stage.querySelectorAll<SVGEllipseElement>('[data-shadow]');
    const pentagons = stage.querySelectorAll<SVGPathElement>('[data-pentagon]');
    const ball = this.ball().nativeElement;
    const ballShadow = this.ballShadow().nativeElement;
    const radius = scene.ballRadius;
    const scale = radius / 6.8;
    // Rolling on the ground turns the ball around the axis across its path
    const axis: [number, number, number] = [scene.direction.y, -scene.direction.x, 0];
    const round = (value: number) => Math.round(value * 100) / 100;

    return frame => {
      stage.setAttribute('opacity', String(round(frame.opacity)));

      frame.players.forEach((pose, index) => {
        const degrees = round((pose.angle * 180) / Math.PI);
        const { root, legs, arms } = players[index];
        root.setAttribute('transform', `translate(${round(pose.x)} ${round(pose.y)}) rotate(${degrees}) scale(${round(scale)})`);
        const swing = 7 * pose.stride;
        legs[0].setAttribute('transform', `translate(${round(swing)} 0)`);
        legs[1].setAttribute('transform', `translate(${round(-swing + 13 * pose.kick)} 0)`);
        arms[0].setAttribute('transform', `translate(${round(-0.55 * swing)} 0)`);
        arms[1].setAttribute('transform', `translate(${round(0.55 * swing)} 0)`);
        shadows[index].setAttribute('transform', `translate(${round(pose.x + 2.5 * scale)} ${round(pose.y + 3.5 * scale)}) rotate(${degrees}) scale(${round(scale)})`);
      });

      const { x, y, distance } = frame.ball;
      ball.setAttribute('transform', `translate(${round(x)} ${round(y)}) scale(${round(radius)})`);
      ballShadow.setAttribute('transform', `translate(${round(x + 1.5 * scale)} ${round(y + 2.5 * scale)}) scale(${round(radius)})`);
      // Orthographic view from above: the half facing the viewer (z < 0) is visible
      const roll = distance / radius;
      PENTAGONS.forEach(([centre, ...corners], index) => {
        if (rotate(centre, axis, roll)[2] > 0.35) {
          pentagons[index].setAttribute('d', '');
          return;
        }
        const points = corners.map(corner => {
          const [px, py, pz] = rotate(corner, axis, roll);
          // Corners on the far side are pushed to the outline of the ball
          const length = pz > 0 ? Math.hypot(px, py) : 1;
          return `${(px / length).toFixed(3)} ${(py / length).toFixed(3)}`;
        });
        pentagons[index].setAttribute('d', `M${points.join('L')}Z`);
      });
    };
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
