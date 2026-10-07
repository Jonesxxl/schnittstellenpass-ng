import { EnvironmentProviders, inject, provideEnvironmentInitializer } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

/** Address of the live site; canonical links point there, also on deploy previews */
export const SITE_URL = 'https://schnittstellenpass.de';

/**
 * Keeps <link rel="canonical"> and og:url on the address of the current page,
 * without anchor or query, so search engines index one URL per page. Also runs
 * while prerendering, so both are part of the HTML.
 */
export function provideCanonicalLink(): EnvironmentProviders {
  return provideEnvironmentInitializer(() => {
    const document = inject(DOCUMENT);
    const router = inject(Router);

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
      document.head.querySelector('meta[property="og:url"]')?.setAttribute('content', url);
    });
  });
}
