import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FactBoardComponent } from './fact-board.component';
import { AboutFact } from '../services/content.service';

describe('FactBoardComponent', () => {
  const facts: AboutFact[] = [
    { value: '45 min', label: 'pro Folge' },
    { value: '14-tägig', label: 'neue Folgen' },
    { value: 'Live', label: 'seit 09/2026' }
  ];

  let reducedMotion: boolean;
  let intersect: (() => void) | null;
  let frames: FrameRequestCallback[];
  const originalObserver = window.IntersectionObserver;

  beforeEach(() => {
    reducedMotion = false;
    intersect = null;
    frames = [];
    spyOn(window, 'matchMedia').and.callFake(query => ({ matches: reducedMotion, media: query } as MediaQueryList));
    window.IntersectionObserver = class {
      constructor(callback: IntersectionObserverCallback) {
        intersect = () => callback([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
      observe(): void {}
      disconnect(): void {}
    } as unknown as typeof IntersectionObserver;
    spyOn(window, 'requestAnimationFrame').and.callFake(callback => frames.push(callback));
  });

  afterEach(() => {
    window.IntersectionObserver = originalObserver;
  });

  async function render(): Promise<ComponentFixture<FactBoardComponent>> {
    const fixture = TestBed.createComponent(FactBoardComponent);
    fixture.componentRef.setInput('facts', facts);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  const shown = (root: HTMLElement) => Array.from(root.querySelectorAll('dd span[aria-hidden="true"]:not(.rounded-full)')).map(span => span.textContent);

  it('should give screen readers each label with its final value', async () => {
    const root = (await render()).nativeElement as HTMLElement;

    expect(Array.from(root.querySelectorAll('dt')).map(dt => dt.textContent)).toEqual(['pro Folge', 'neue Folgen', 'seit 09/2026']);
    expect(Array.from(root.querySelectorAll('dd .sr-only')).map(span => span.textContent)).toEqual(['45 min', '14-tägig', 'Live']);
  });

  it('should count the numbers up once the board scrolls into view', async () => {
    const fixture = await render();
    const root = fixture.nativeElement as HTMLElement;
    expect(shown(root)).toEqual(['0 min', '0-tägig', 'Live']);

    intersect!();
    // Angular's scheduler queues frames too: run all of them, well after the count-up
    frames.splice(0).forEach(frame => frame(performance.now() + 10_000));
    fixture.detectChanges();

    expect(shown(root)).toEqual(['45 min', '14-tägig', 'Live']);
  });

  it('should show the final values right away with reduced motion', async () => {
    reducedMotion = true;
    const root = (await render()).nativeElement as HTMLElement;

    expect(shown(root)).toEqual(['45 min', '14-tägig', 'Live']);
    expect(root.querySelector('.animate-flipin, .animate-drawline')).toBeNull();
  });

  it('should mark live facts with the pulsing dot', async () => {
    const root = (await render()).nativeElement as HTMLElement;
    const dots = Array.from(root.querySelectorAll('dd')).map(dd => dd.querySelector('.bg-signal') !== null);

    expect(dots).toEqual([false, false, true]);
  });
});
