import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { firstValueFrom } from 'rxjs';
import { FolgenService } from './folgen/folgen.service';

/**
 * Pages written as HTML at build time (outputMode "static" in angular.json),
 * so search engines and link previews get the content without running scripts.
 * CMS texts end up in that HTML; each CMS change triggers a new build anyway.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'folgen', renderMode: RenderMode.Prerender },
  {
    // One page per episode in the feed (scripts/fetch-feed.mjs); none if the build could not read it
    path: 'folgen/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => (await firstValueFrom(inject(FolgenService).episodes())).map(episode => ({ slug: episode.slug }))
  },
  { path: 'impressum', renderMode: RenderMode.Prerender },
  { path: 'datenschutz', renderMode: RenderMode.Prerender },
  // Unknown URLs: the router redirects to the one-pager in the browser
  { path: '**', renderMode: RenderMode.Client }
];
