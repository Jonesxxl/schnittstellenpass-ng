import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs';
import { FeedEpisode, FolgenService } from './folgen.service';

const slugOf = (route: Parameters<ResolveFn<unknown>>[0]) => route.paramMap.get('slug') ?? '';

/** The episode of /folgen/:slug, or null if there is none */
export const episodeResolver: ResolveFn<FeedEpisode | null> = route => inject(FolgenService).episode(slugOf(route));

/** <title> of an episode page (see shared/page-meta.ts) */
export const episodeTitle: ResolveFn<string> = route => inject(FolgenService).episode(slugOf(route)).pipe(
  map(episode => episode ? `${episode.title} – Schnittstellenpass` : 'Folge nicht gefunden – Schnittstellenpass')
);

/** Description of an episode page: the start of its show notes, as long as search results show it */
export const episodeDescription: ResolveFn<string> = route => inject(FolgenService).episode(slugOf(route)).pipe(
  map(episode => episode ? teaser(episode.summary) : 'Diese Folge gibt es nicht (mehr). Alle Folgen von Schnittstellenpass findest du im Archiv.')
);

const DESCRIPTION_LENGTH = 160;

function teaser(text: string): string {
  if (Array.from(text).length <= DESCRIPTION_LENGTH) {
    return text;
  }
  const cut = Array.from(text).slice(0, DESCRIPTION_LENGTH - 1).join('');
  const space = cut.lastIndexOf(' ');
  return `${(space > 0 ? cut.slice(0, space) : cut).trimEnd()}…`;
}
