import { Component, computed, signal, inject, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { SpotifyService } from '../services/spotify.service';
import { Episode } from '../models/spotify.models';

interface SocialLink {
  id: string;
  name: string;
  icon: string;
  url: string;
  color: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  template: `
    <!-- Hero Section mit Fußballfeld-Ästhetik -->
    <div class="relative min-h-screen bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 overflow-hidden">

      <!-- Fußballfeld-Grid Overlay -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute inset-0 grid grid-cols-6 grid-rows-6">
          @for (i of gridLines(); track i) {
            <div class="border border-white/30"></div>
          }
        </div>
        <!-- Mittelkreis -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-white/30 rounded-full pointer-events-none"></div>
      </div>

      <!-- Main Hero Content -->
      <main class="relative z-10 container mx-auto max-w-7xl px-4 md:px-8 pt-24 pb-16 md:pt-32 md:pb-24">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start lg:items-center">

          <!-- Left Column - Text Content -->
          <div class="space-y-8 lg:pr-8">


            <!-- Main Title -->
            <div class="space-y-4">
              <h2 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-tight flex flex-col">
                <span class="animate-fly-in-right">SCHNITT</span>
                <span class="animate-fly-in-left animation-delay-200">STELLEN</span>
                <span class="animate-fly-in-right animation-delay-400">PASS</span>
              </h2>
              <div class="h-2 w-24 md:w-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
            </div>

            <!-- Subtitle -->
            <p class="text-lg md:text-xl lg:text-2xl text-gray-700 font-medium leading-relaxed max-w-xl">
              {{ subtitle() }}
            </p>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-4 md:gap-6 pt-4">
              @for (stat of stats(); track stat.id) {
                <div class="text-center lg:text-left">
                  <div class="text-2xl md:text-4xl font-black text-gray-900 mb-1">{{ stat.value }}</div>
                  <div class="text-xs md:text-sm text-gray-600 font-semibold">{{ stat.label }}</div>
                </div>
              }
            </div>



            <!-- Platform Badges -->
            <div class="mt-6 flex flex-wrap gap-5">
              @for (platform of platforms(); track platform.id) {
                <a
                  [href]="platform.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl text-sm font-semibold text-gray-800 hover:bg-white/70 hover:border-white/60 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  [attr.aria-label]="'Auf ' + platform.name + ' anhören'">
                  <img [src]="platform.icon" [alt]="platform.name + ' logo'" class="w-5 h-5">
                  {{ platform.name }}
                </a>
              }
            </div>
          </div>

          <!-- Right Column - Hero Image/Card -->
          <div class="relative lg:sticky lg:top-24">
            <!-- Main Card mit Glassmorphism -->
            <div class="relative backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
              <!-- Decorative Elements -->
              <div class="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-2xl opacity-60 animate-pulse pointer-events-none"></div>
              <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-2xl opacity-60 animate-pulse animation-delay-1000 pointer-events-none"></div>

              <!-- Latest Episode -->
              <div class="relative">
                <div class="mb-4">
                  <span class="inline-flex items-center px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                    ⚡ NEUESTE FOLGE
                  </span>
                </div>

                <!-- Episode Cover -->
                <div
                  class="relative aspect-square mb-6 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
                  (click)="onPlayLatest()">
                  <img
                    [src]="latestEpisode()?.imageUrl || '/assets/cover.jpg'"
                    [alt]="latestEpisode()?.title || 'Schnittstellenpass Podcast Cover'"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 400%22%3E%3Crect fill=%22%23cbd5e1%22 width=%22400%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2280%22 fill=%22%231e293b%22 font-weight=%22bold%22%3ESP%3C/text%3E%3C/svg%3E'">
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                  <!-- Play Button Overlay -->
                  <button
                    type="button"
                    (click)="onPlayLatest(); $event.stopPropagation()"
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-2xl focus:outline-none focus:ring-4 focus:ring-white"
                    aria-label="Episode abspielen">
                    <svg class="w-10 h-10 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                    </svg>
                  </button>
                </div>

                @if (latestEpisode(); as episode) {
                  <div class="space-y-3">
                    <h3 class="text-2xl font-bold text-gray-900 line-clamp-2">{{ episode.title }}</h3>
                    <p class="text-gray-700 line-clamp-2">{{ episode.description }}</p>
                    <div class="flex items-center gap-3 text-sm text-gray-600">
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                        </svg>
                        {{ episode.duration }}
                      </span>
                      <span>•</span>
                      <time [attr.datetime]="episode.date">{{ episode.date }}</time>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-4 pt-4">
              <button
                type="button"
                (click)="onListenNow()"
                class="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300"
                aria-label="Jetzt anhören">
                <span class="relative z-10 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                  </svg>
                  Jetzt anhören
                </span>
                <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                type="button"
                (click)="onShowMore()"
                class="px-8 py-4 bg-white/50 backdrop-blur-sm border-2 border-gray-300 text-gray-900 font-bold rounded-xl hover:bg-white/70 hover:border-gray-400 transition-all duration-300 hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-300"
                aria-label="Mehr erfahren">
                Mehr erfahren
              </button>
            </div>
          </div>
        </div>
      </main>

      <!-- Features Section -->
      <section class="relative z-10 container mx-auto max-w-7xl px-4 md:px-8 pb-24">
        <div class="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-8 md:p-12 shadow-2xl">
          <h3 class="text-3xl md:text-4xl font-black text-gray-900 mb-8 text-center">
            Warum Schnittstellenpass?
          </h3>

          <div class="grid md:grid-cols-3 gap-8">
            @for (feature of features(); track feature.id) {
              <div class="text-center space-y-4 p-6 rounded-2xl hover:bg-white/30 transition-colors duration-300">
                <div class="text-5xl mb-4" aria-hidden="true">{{ feature.icon }}</div>
                <h4 class="text-xl font-bold text-gray-900">{{ feature.title }}</h4>
                <p class="text-gray-700">{{ feature.description }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="relative z-10 backdrop-blur-md bg-white/10 border-t border-white/20 py-8">
        <div class="container mx-auto max-w-7xl px-4 md:px-8">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-sm text-gray-700 font-medium">
              © 2025 Schnittstellenpass | Zwischen Profi & Amateur
            </p>
            <div class="flex items-center gap-6 text-sm text-gray-600">
              <a href="#" class="hover:text-gray-900 transition-colors focus:outline-none focus:text-gray-900">Datenschutz</a>
              <a href="#" class="hover:text-gray-900 transition-colors focus:outline-none focus:text-gray-900">Impressum</a>
              <a href="#" class="hover:text-gray-900 transition-colors focus:outline-none focus:text-gray-900">Kontakt</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .animation-delay-1000 {
      animation-delay: 1s;
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    @keyframes flyInRight {
      0% {
        transform: translateX(100%);
        opacity: 0;
      }
      100% {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes flyInLeft {
      0% {
        transform: translateX(-100%);
        opacity: 0;
      }
      100% {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .animate-fly-in-right {
      animation: flyInRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    .animate-fly-in-left {
      animation: flyInLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    .animation-delay-200 {
      animation-delay: 0.2s;
      opacity: 0;
    }

    .animation-delay-400 {
      animation-delay: 0.4s;
      opacity: 0;
    }
  `]
})
export class LandingComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly spotifyService = inject(SpotifyService);

  // State
  protected mainTitle = signal('SCHNITTSTELLENPASS');
  protected subtitle = signal('Der Fußball-Podcast zwischen Profi und Amateur. Taktik, Analysen und spannende Gespräche über das schönste Spiel der Welt.');
  protected isLoading = signal(false);
  protected showSpotifyUrl = signal('');

  // Stats
  protected stats = signal([
    { id: '1', value: '50+', label: 'Episoden' },
    { id: '2', value: '10K+', label: 'Hörer' },
    { id: '3', value: '4.9★', label: 'Bewertung' }
  ]);

  // Social Links
  protected platforms = signal<SocialLink[]>([
    { id: '1', name: 'Spotify', icon: '/assets/icons/spotify-logo.svg', url: 'https://open.spotify.com/show/4gpxvhJ8WyrGAnba5A6LQc', color: '#1DB954' },
    { id: '2', name: 'YouTube', icon: '/assets/icons/youtube-logo.svg', url: 'https://www.youtube.com/@schnittstellenpass1105', color: '#FF0000' },
    { id: '3', name: 'Apple Podcasts', icon: '/assets/icons/apple-logo.svg', url: 'https://podcasts.apple.com/us/search?term=schnittstellenpass%20-%20zwischen%20profi%20und%20amateur', color: '#9333EA' },
    { id: '4', name: 'Instagram', icon: '/assets/icons/instagram-logo.svg', url: 'https://www.instagram.com/schnittstellenpass/', color: '#E4405F' }
  ]);

  // Platforms
  protected xx = signal([
    { id: '1', name: 'Spotify', icon: '🎵', url: 'https://spotify.com' },
    { id: '2', name: 'Apple', icon: '🎧', url: 'https://podcasts.apple.com' },
    { id: '3', name: 'YouTube', icon: '▶️', url: 'https://youtube.com' }
  ]);

  // Latest Episode
  protected latestEpisode = signal<Episode | null>(null);

  // Features
  protected features = signal([
    {
      id: '1',
      icon: '⚽',
      title: 'Taktik & Analyse',
      description: 'Professionelle Spielanalysen verständlich erklärt'
    },
    {
      id: '2',
      icon: '🎙️',
      title: 'Spannende Gäste',
      description: 'Experten, Trainer und ehemalige Profis im Gespräch'
    },
    {
      id: '3',
      icon: '📊',
      title: 'Datenbasiert',
      description: 'Moderne Statistiken und deren Bedeutung für das Spiel'
    }
  ]);

  // Grid für Fußballfeld
  protected gridLines = computed(() => Array.from({ length: 36 }, (_, i) => i));

  ngOnInit(): void {
    this.loadSpotifyData();
  }

  /**
   * Load data from Spotify API
   */
  private loadSpotifyData(): void {
    this.isLoading.set(true);

    // Fetch latest episode
    this.spotifyService.getLatestEpisode().subscribe({
      next: (episode) => {
        if (episode) {
          this.latestEpisode.set(episode);
        }
      },
      error: (error) => {
        console.error('Failed to fetch latest episode:', error);
        // Keep default placeholder if fetch fails
        this.latestEpisode.set({
          id: '1',
          title: 'Taktische Meisterwerke: Die besten Spielzüge der Saison',
          description: 'Eine tiefgehende Analyse der genialsten taktischen Schachzüge und was wir daraus für Amateur und Profi lernen können.',
          date: '20.11.2025',
          duration: '45:00',
          spotifyUrl: 'https://open.spotify.com/show/4gpxvhJ8WyrGAnba5A6LQc',
          imageUrl: '/assets/cover.jpg',
          audioPreviewUrl: null
        });
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });

    // Fetch show stats
    this.spotifyService.getShowStats().subscribe({
      next: (stats) => {
        this.stats.set([
          { id: '1', value: `${stats.totalEpisodes}+`, label: 'Episoden' },
          { id: '2', value: stats.listeners, label: 'Hörer' },
          { id: '3', value: `${stats.rating}★`, label: 'Bewertung' }
        ]);
      },
      error: (error) => {
        console.error('Failed to fetch show stats:', error);
      }
    });

    // Fetch show URL
    this.spotifyService.getShowUrl().subscribe({
      next: (url) => {
        this.showSpotifyUrl.set(url);
      },
      error: (error) => {
        console.error('Failed to fetch show URL:', error);
        this.showSpotifyUrl.set('https://open.spotify.com/show/4gpxvhJ8WyrGAnba5A6LQc');
      }
    });
  }

  // Actions

  protected onSubscribe(): void {
    const url = this.showSpotifyUrl() || 'https://open.spotify.com/show/4gpxvhJ8WyrGAnba5A6LQc';
    this.spotifyService.openSpotify(url);
  }

  protected onListenNow(): void {
    const episode = this.latestEpisode();
    if (episode?.spotifyUrl) {
      this.spotifyService.openSpotify(episode.spotifyUrl);
    } else {
      const url = this.showSpotifyUrl() || 'https://open.spotify.com/show/4gpxvhJ8WyrGAnba5A6LQc';
      this.spotifyService.openSpotify(url);
    }
  }

  protected onShowMore(): void {
    this.router.navigate(['/about']);
  }

  protected onPlayLatest(): void {
    const episode = this.latestEpisode();
    if (episode?.spotifyUrl) {
      this.spotifyService.openSpotify(episode.spotifyUrl);
    } else {
      const url = this.showSpotifyUrl() || 'https://open.spotify.com/show/4gpxvhJ8WyrGAnba5A6LQc';
      this.spotifyService.openSpotify(url);
    }
  }
}
