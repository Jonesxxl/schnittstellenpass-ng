import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withNoIncrementalHydration } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnchorScrolling } from './shared/anchor-scrolling';
import { providePageMeta } from './shared/page-meta';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    // Pages are prerendered at build time (app.routes.server.ts); the browser takes over their HTML.
    // Without incremental hydration (default since v22): it brings event replay, whose inline
    // scripts the CSP in src/index.html blocks. No @defer hydrate triggers are used.
    provideClientHydration(withNoIncrementalHydration()),
    // Router emits scroll events only; provideAnchorScrolling() handles them
    provideRouter(routes, withInMemoryScrolling()),
    provideAnchorScrolling(),
    providePageMeta(),
    // Fetch, so prerendering can load the CMS files in public/content from the build
    provideHttpClient(withFetch())
  ]
};
