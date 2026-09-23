import { ApplicationRef, EnvironmentProviders, NgZone, inject, provideEnvironmentInitializer } from '@angular/core';
import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Router, Scroll } from '@angular/router';

/**
 * Scrolls smoothly to the sections of the one-pager, but jumps instantly when
 * another page opens or history is restored. The router's own scroll handling
 * cannot make that distinction: combined with CSS scroll-behavior: smooth, the
 * Impressum opened from the footer would visibly scroll up from the bottom.
 *
 * Requires withInMemoryScrolling() with its defaults (both options disabled),
 * so the router still emits Scroll events but leaves scrolling to this handler.
 */
export function provideAnchorScrolling(): EnvironmentProviders {
  return provideEnvironmentInitializer(() => {
    const scroller = inject(ViewportScroller);
    const appRef = inject(ApplicationRef);
    const zone = inject(NgZone);
    const document = inject(DOCUMENT);
    let latestAnchorScroll = 0;

    scroller.setHistoryScrollRestoration('manual');

    inject(Router).events.subscribe(event => {
      if (!(event instanceof Scroll)) {
        return;
      }
      if (event.position) {
        scroller.scrollToPosition(event.position, { behavior: 'instant' });
        return;
      }
      if (!event.anchor) {
        scroller.scrollToPosition([0, 0], { behavior: 'instant' });
        return;
      }

      const anchor = event.anchor;
      const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
      const targetTop = () => document.getElementById(anchor)?.getBoundingClientRect().top ?? 0;
      const scrollId = ++latestAnchorScroll;
      const initialTarget = targetTop() + window.scrollY;
      scroller.scrollToAnchor(anchor, { behavior });

      // Content above the section may still be loading (e.g. the latest episode)
      // and push it down while scrolling. Aim again once everything has loaded,
      // unless another navigation happened or the user took over scrolling.
      let userScrolled = false;
      const onUserScroll = () => userScrolled = true;
      const userEvents = ['wheel', 'touchstart', 'keydown'] as const;
      zone.runOutsideAngular(() => userEvents.forEach(type => window.addEventListener(type, onUserScroll, { passive: true })));

      appRef.whenStable().then(() => {
        userEvents.forEach(type => window.removeEventListener(type, onUserScroll));
        const moved = Math.abs(targetTop() + window.scrollY - initialTarget) > 1;
        if (moved && !userScrolled && scrollId === latestAnchorScroll) {
          scroller.scrollToAnchor(anchor, { behavior });
        }
      });
    });
  });
}
