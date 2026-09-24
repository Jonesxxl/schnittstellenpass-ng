import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { ContentService, DEFAULT_ABOUT_INTRO, DEFAULT_HOME_HERO } from '../services/content.service';
import { SpotifyService } from '../services/spotify.service';
import { InstagramFeedService } from '../services/instagram-feed.service';
import { ImageSlotComponent } from '../shared/image-slot.component';
import { RevealDirective } from '../shared/reveal.directive';
import { LINKS } from '../shared/links';

interface ImageArea {
  placeholder: string;
  // Path of the photo, e.g. 'assets/images/host.jpg'; the placeholder is shown until it is set
  src?: string;
}

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

  // Rows of the episode list, also shown as placeholders while loading
  protected readonly episodeRows = [0, 1, 2, 3, 4, 5];

  // Newest first, for the "Aktuelle Folge" card and the episode list; null if Spotify cannot be reached
  protected readonly episodes = rxResource({
    stream: () => this.spotifyService.getLatestEpisodes(this.episodeRows.length)
  });

  // Latest posts for the "Aus der Kabine" tiles; tiles without a post keep their placeholder
  protected readonly instagramPosts = rxResource({
    stream: () => this.instagramFeedService.getLatestPosts(),
    defaultValue: []
  });

  protected readonly livePhoto: ImageArea = { src: 'assets/live-event.webp', placeholder: 'Foto von der ersten Live-Folge' };
  protected readonly hostPortrait: ImageArea = { src: 'assets/host-portrait.webp', placeholder: 'Portrait von Agy' };
  protected readonly instagramTiles = ['Instagram-Post 1', 'Instagram-Post 2', 'Instagram-Post 3', 'Instagram-Post 4'];

  protected readonly facts = [
    { value: '45\'', label: 'pro Folge' },
    { value: '14-tägig', label: 'neue Folgen' },
    { value: 'Live', label: 'seit 09/2026' }
  ];
}
