import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { ContentService, DEFAULT_ABOUT_INTRO, DEFAULT_EPISODES, DEFAULT_HOME_HERO, DEFAULT_LIVE, DEFAULT_SOCIAL } from '../services/content.service';
import { SpotifyService } from '../services/spotify.service';
import { InstagramFeedService } from '../services/instagram-feed.service';
import { ImageSlotComponent } from '../shared/image-slot.component';
import { RevealDirective } from '../shared/reveal.directive';
import { LINKS } from '../shared/links';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ImageSlotComponent, RevealDirective],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  private readonly spotifyService = inject(SpotifyService);
  private readonly contentService = inject(ContentService);
  private readonly instagramFeedService = inject(InstagramFeedService);

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

  protected readonly episodes = rxResource({
    stream: () => this.contentService.getEpisodesContent(),
    defaultValue: DEFAULT_EPISODES
  });

  protected readonly social = rxResource({
    stream: () => this.contentService.getSocialContent(),
    defaultValue: DEFAULT_SOCIAL
  });

  // Resolves to null if Spotify cannot be reached
  protected readonly latestEpisode = rxResource({
    stream: () => this.spotifyService.getLatestEpisode()
  });

  // Latest posts for the "Aus der Kabine" tiles; tiles without a post keep their placeholder
  protected readonly instagramPosts = rxResource({
    stream: () => this.instagramFeedService.getLatestPosts(),
    defaultValue: []
  });

  protected readonly instagramTiles = ['Instagram-Post 1', 'Instagram-Post 2', 'Instagram-Post 3', 'Instagram-Post 4'];
}
