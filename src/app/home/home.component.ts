import { Component, PLATFORM_ID, computed, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { ContentService, DEFAULT_ABOUT_INTRO, DEFAULT_EPISODES, DEFAULT_HOME_HERO, DEFAULT_LIVE, DEFAULT_SOCIAL } from '../services/content.service';
import { SpotifyService } from '../services/spotify.service';
import { Episode } from '../models/spotify.models';
import { ImageSlotComponent } from '../shared/image-slot.component';
import { InstagramFeedComponent } from '../instagram/instagram-feed.component';
import { RevealDirective } from '../shared/reveal.directive';
import { FactBoardComponent } from './fact-board.component';
import { LINKS } from '../shared/links';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ImageSlotComponent, InstagramFeedComponent, RevealDirective, FactBoardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  private readonly spotifyService = inject(SpotifyService);
  private readonly contentService = inject(ContentService);
  private readonly platformId = inject(PLATFORM_ID);

  // Switch off the live announcement banner / the pitch markings in the hero
  protected readonly showLive = true;
  protected readonly showPitch = true;

  protected readonly links = LINKS;

  protected readonly hero = rxResource({
    stream: () => this.contentService.getHomeHeroContent(),
    defaultValue: DEFAULT_HOME_HERO
  });

  protected readonly host = rxResource({
    stream: () => this.contentService.getAboutIntroContent(),
    defaultValue: DEFAULT_ABOUT_INTRO
  });

  protected readonly live = rxResource({
    stream: () => this.contentService.getLiveContent(),
    defaultValue: DEFAULT_LIVE
  });

  // Texts of the episode section from the CMS; the episodes themselves come from Spotify
  protected readonly episodeSection = rxResource({
    stream: () => this.contentService.getEpisodesContent(),
    defaultValue: DEFAULT_EPISODES
  });

  protected readonly social = rxResource({
    stream: () => this.contentService.getSocialContent(),
    defaultValue: DEFAULT_SOCIAL
  });

  // Rows of the episode list, also shown as placeholders while loading
  protected readonly episodeRows = [0, 1, 2, 3, 4, 5];

  // Episodes as of the last build: prerendering puts them into the HTML for search engines,
  // and the browser gets the same list for hydration
  private readonly episodeSnapshot = rxResource({
    stream: () => this.spotifyService.getEpisodeSnapshot(this.episodeRows.length)
  });

  // Current episodes from the Netlify function, in the browser only (it does not exist while prerendering)
  private readonly liveEpisodes = rxResource({
    params: () => isPlatformBrowser(this.platformId) || undefined,
    stream: () => this.spotifyService.getLatestEpisodes(this.episodeRows.length)
  });

  // Newest first, for the "Aktuelle Folge" card and the episode list: the live list, else the
  // snapshot; null if Spotify cannot be reached and there is no snapshot, undefined while loading
  protected readonly episodes = computed<Episode[] | null | undefined>(() => {
    const live = this.liveEpisodes.value();
    const snapshot = this.episodeSnapshot.value();
    if (live) {
      return live;
    }
    if (snapshot) {
      return snapshot;
    }
    return this.liveEpisodes.hasValue() ? null : undefined;
  });

  protected readonly episodesLoading = computed(() => this.episodes() === undefined);
}
