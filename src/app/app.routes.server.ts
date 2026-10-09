import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Pages written as HTML at build time (outputMode "static" in angular.json),
 * so search engines and link previews get the content without running scripts.
 * CMS texts end up in that HTML; each CMS change triggers a new build anyway.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'impressum', renderMode: RenderMode.Prerender },
  { path: 'datenschutz', renderMode: RenderMode.Prerender },
  // Unknown URLs: the router redirects to the one-pager in the browser
  { path: '**', renderMode: RenderMode.Client }
];
