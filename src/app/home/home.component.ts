import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { ContentService, DEFAULT_ABOUT_INTRO, DEFAULT_HOME_HERO } from '../services/content.service';
import { SpotifyService } from '../services/spotify.service';
import { ImageSlotComponent } from '../shared/image-slot.component';
import { RevealDirective } from '../shared/reveal.directive';
import { LINKS } from '../shared/links';

interface FeaturedEpisode {
  badge: string;
  guest: string;
  description: string;
  tag: string;
}

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

  // Resolves to null if Spotify cannot be reached
  protected readonly latestEpisode = rxResource({
    stream: () => this.spotifyService.getLatestEpisode()
  });

  protected readonly livePhoto: ImageArea = { src: 'assets/live-event.webp', placeholder: 'Foto von der ersten Live-Folge' };
  protected readonly hostPortrait: ImageArea = { src: 'assets/host-portrait.webp', placeholder: 'Portrait von Agy' };
  protected readonly instagramPosts: ImageArea[] = [
    { placeholder: 'Instagram-Post 1' },
    { placeholder: 'Instagram-Post 2' },
    { placeholder: 'Instagram-Post 3' },
    { placeholder: 'Instagram-Post 4' }
  ];

  protected readonly featuredEpisodes: FeaturedEpisode[] = [
    { badge: 'NEU', guest: 'Sebastian „Kiwi“ Müller', description: 'Die Zukunft des Amateurfußballs: Ehrenamt, Verbandsarbeit, Nachwuchs.', tag: 'Amateur' },
    { badge: '', guest: 'Nick Fennell', description: 'Vom Amateurbereich über den Profifußball zum Spielerberater.', tag: 'Profi' },
    { badge: '', guest: 'Matthias Esch', description: 'Fußballjournalismus von der Kreisliga bis zu FUMS und Stadionumfrage.', tag: 'Medien' },
    { badge: '', guest: 'Peter Hyballa', description: 'Der erfahrene Trainer über Ansprache, Druck und Leidenschaft.', tag: 'Trainer' },
    { badge: 'S2 · 8', guest: 'Jan Kirchhoff', description: 'Unter Guardiola und Tuchel: Bundesliga, Premier League und Trainerpläne.', tag: 'Profi' },
    { badge: 'S1 · 2', guest: 'Marco Caligiuri', description: 'Trainertypen, die Mainzer Boyband und Trainingsbetrüger.', tag: 'Profi' }
  ];

  protected readonly facts = [
    { value: '45\'', label: 'pro Folge' },
    { value: '14-tägig', label: 'neue Folgen' },
    { value: 'Live', label: 'seit 09/2026' }
  ];
}
