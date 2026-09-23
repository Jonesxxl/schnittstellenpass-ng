import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withXhr } from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnchorScrolling } from './shared/anchor-scrolling';

export const appConfig: ApplicationConfig = {
  providers: [
    // Router emits scroll events only; provideAnchorScrolling() handles them
    provideRouter(routes, withInMemoryScrolling()),
    provideAnchorScrolling(),
    provideHttpClient(withXhr())
  ]
};
