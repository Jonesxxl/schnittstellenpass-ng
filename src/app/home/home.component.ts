import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { ContentService, DEFAULT_ABOUT_INTRO, DEFAULT_EPISODES, DEFAULT_HOME_HERO, DEFAULT_LIVE, DEFAULT_SOCIAL } from '../services/content.service';
import { SpotifyService } from '../services/spotify.service';
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

  // Newest first, for the "Aktuelle Folge" card and the episode list; null if Spotify cannot be reached
  protected readonly episodes = rxResource({
    stream: () => this.spotifyService.getLatestEpisodes(this.episodeRows.length)
  });
}
