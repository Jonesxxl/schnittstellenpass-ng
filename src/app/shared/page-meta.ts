import { EnvironmentProviders, inject, provideEnvironmentInitializer } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';

/** Address of the live site; canonical links point there, also on deploy previews */
export const SITE_URL = 'https://schnittstellenpass.de';

/**
 * Keeps the head of the page in line with the current route, also while
 * prerendering, so all of it is part of the HTML:
 * - <link rel="canonical"> and og:url: the page's address without anchor or
 *   query, so search engines index one URL per page
 * - description, og:title and og:description: from the route's `title` and
 *   `data.description` in app.routes.ts (the router sets <title> itself)
 */
export function providePageMeta(): EnvironmentProviders {
  return provideEnvironmentInitializer(() => {
    const document = inject(DOCUMENT);
    const router = inject(Router);

    const setAttribute = (selector: string, name: string, value: string | undefined) => {
      if (value) {
        document.head.querySelector(selector)?.setAttribute(name, value);
      }
    };

    router.events.subscribe(event => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      const segments = router.parseUrl(event.urlAfterRedirects).root.children['primary']?.segments ?? [];
      const url = `${SITE_URL}/${segments.map(segment => segment.path).join('/')}`;

      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', url);
      setAttribute('meta[property="og:url"]', 'content', url);

      let page: ActivatedRouteSnapshot = router.routerState.snapshot.root;
      while (page.firstChild) {
        page = page.firstChild;
      }
      const description: string | undefined = page.data['description'];
      setAttribute('meta[name="description"]', 'content', description);
      setAttribute('meta[property="og:description"]', 'content', description);
      setAttribute('meta[property="og:title"]', 'content', page.title);
    });
  });
}
