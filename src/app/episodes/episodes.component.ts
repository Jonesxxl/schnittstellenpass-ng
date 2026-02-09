import { Component, signal, OnInit, inject } from '@angular/core';

import { SpotifyService } from '../services/spotify.service';
import { SpotifyEpisode } from '../models/spotify.models';

interface Episode {
  id: string;
  title: string;
  date: string;
  duration: string;
  episodeNumber: number;
  thumbnail?: string;
  spotifyUrl: string;
  youtubeUrl: string;
  appleMusicUrl: string;
  description?: string;
}

@Component({
  selector: 'app-episodes',
  standalone: true,
  imports: [],
  template: `
    <!-- Fußball Podcast Design - Stadium Theme -->
    <div class="relative min-h-screen bg-gradient-to-br from-green-600 via-green-500 to-green-700 overflow-x-hidden overflow-y-auto">

      <!-- Rasen-Textur Overlay -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 80px);"></div>
        <div class="absolute inset-0" style="background-image: repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.05) 60px, rgba(255,255,255,0.05) 120px);"></div>
      </div>

      <!-- Stadion Lichter Effect -->
      <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/30 to-transparent"></div>

      <!-- Mittelkreis Dekoration -->
      <div class="hidden md:block absolute top-20 right-10 w-48 h-48 border-8 border-white/20 rounded-full pointer-events-none"></div>
      <div class="hidden md:block absolute bottom-20 left-10 w-32 h-32 border-8 border-white/20 rounded-full pointer-events-none"></div>

      <!-- Main Content -->
      <main class="relative z-10 container mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-20">

        <!-- Page Header - Stadium Banner Style -->
        <div class="bg-white rounded-3xl p-8 md:p-12 shadow-2xl mb-12 border-4 border-green-600">
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 text-center">
            <div class="text-5xl sm:text-6xl" aria-hidden="true">⚽</div>
            <div class="text-center">
              <h1 class="text-4xl md:text-6xl font-black text-green-700 tracking-tight uppercase">
                Episoden
              </h1>
              <p class="text-xl md:text-2xl text-gray-700 font-bold mt-2">
                Die letzten 5 Folgen 🎙️
              </p>
            </div>
            <div class="text-5xl sm:text-6xl" aria-hidden="true">⚽</div>
          </div>

        </div>

        <!-- Loading Indicator -->
        @if (isLoading()) {
          <div class="bg-white rounded-2xl p-12 shadow-2xl border-4 border-green-600 text-center">
            <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 border-r-4 border-green-600 border-b-4 border-transparent mb-6"></div>
            <p class="text-xl text-gray-700 font-bold">⚽...</p>
          </div>
        }

        <!-- No Episodes Message -->
        @if (!isLoading() && episodes().length === 0) {
          <div class="bg-white rounded-2xl p-12 shadow-2xl border-4 border-green-600 text-center">
            <div class="text-5xl mb-4">😢</div>
            <p class="text-xl text-gray-700 font-bold">Keine Episoden gefunden.</p>
            <p class="text-gray-600 mt-2">Bitte versuche es später noch einmal.</p>
          </div>
        }

        <!-- Episodes Grid - Spielerkarten-Style -->
        <div class="grid grid-cols-1 gap-8">
          @for (episode of episodes(); track episode.id; let i = $index) {
            <div class="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden border-4 border-green-600 hover:border-yellow-400 transition-all duration-300 md:hover:scale-[1.02] hover:shadow-3xl">

              <!-- Episode Card Header - Jersey Style -->
              <div class="bg-gradient-to-r from-green-600 to-green-700 p-6 relative overflow-hidden">
                <div class="absolute top-0 right-0 text-6xl md:text-9xl font-black text-white/10 pointer-events-none">
                  #{{ episode.episodeNumber }}
                </div>
                <div class="relative z-10">
                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                    <div class="bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-white/40 w-fit">
                      <span class="text-white font-black text-sm sm:text-lg">#{{ episode.episodeNumber }}</span>
                    </div>
                    <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-white text-xs sm:text-sm w-full sm:w-auto">
                      <div class="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <span class="text-lg sm:text-xl">📅</span>
                        <span class="font-bold">{{ episode.date }}</span>
                      </div>
                      <div class="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <span class="text-lg sm:text-xl">⏱️</span>
                        <span class="font-bold">{{ episode.duration }}</span>
                      </div>
                    </div>
                  </div>
                  <h2 class="text-xl sm:text-2xl md:text-3xl font-black text-white drop-shadow-lg mt-4">
                    {{ episode.title }}
                  </h2>
                </div>
              </div>

              <!-- Episode Card Body -->
              <div class="p-6 md:p-8">

                <!-- Platform Links Section -->
                <div class="mb-6">
                  <h3 class="text-lg font-black text-gray-700 mb-4 flex items-center gap-2">
                    <span class="text-2xl">🎧</span>
                    Jetzt anhören auf:
                  </h3>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- Spotify Link -->
                    <a
                      [href]="episode.spotifyUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="group flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 md:hover:scale-105">
                      <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                      <div class="flex-1 text-left">
                        <div class="text-xs opacity-90">Spotify</div>
                        <div class="text-sm font-black">Jetzt hören</div>
                      </div>
                      <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </a>

                    <!-- YouTube Link -->
                    <a
                      [href]="episode.youtubeUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="group flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 md:hover:scale-105">
                      <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      <div class="flex-1 text-left">
                        <div class="text-xs opacity-90">YouTube</div>
                        <div class="text-sm font-black">Video ansehen</div>
                      </div>
                      <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </a>

                    <!-- Apple Music Link -->
                    <a
                      [href]="episode.appleMusicUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="group flex items-center gap-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 md:hover:scale-105">
                      <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 0 0-1.877-.726 10.496 10.496 0 0 0-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.54.605-2.5 1.68-2.986 3.21-.192.604-.293 1.23-.351 1.862-.026.29-.051.58-.051.87v11.28c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 0 0 1.57-.1c.822-.106 1.596-.35 2.296-.81a5.046 5.046 0 0 0 1.88-2.207c.186-.42.293-.87.353-1.333.047-.353.07-.71.073-1.067v-11.3c0-.14-.01-.28-.014-.418zM14.55 14.615c-.788.326-1.585.614-2.395.837-.592.163-1.194.283-1.803.344-.193.02-.387.037-.58.04-.115.002-.922-.009-1.036-.02-.49-.048-.978-.124-1.46-.24-.735-.178-1.462-.4-2.114-.81-.465-.294-.875-.65-1.122-1.146-.137-.275-.203-.57-.2-.878.003-.318.11-.61.297-.87.305-.424.696-.682 1.17-.86.51-.193 1.04-.306 1.576-.36.246-.024.494-.035.742-.027.36.01.717.05 1.072.107 1.03.164 2.028.476 3.01.816.036.013.072.024.11.035v-7.89c0-.085.01-.17.024-.25.034-.195.132-.36.293-.49.184-.15.397-.197.618-.197.036 0 .072.003.108.008.16.022.32.047.48.08 1.21.244 2.412.52 3.598.877.222.067.444.14.664.22.126.045.24.111.335.212.17.18.253.395.253.64v8.338c0 .58-.004 1.16-.01 1.74 0 .02-.005.04-.008.06z"/>
                      </svg>
                      <div class="flex-1 text-left">
                        <div class="text-xs opacity-90">Apple Music</div>
                        <div class="text-sm font-black">Podcast öffnen</div>
                      </div>
                      <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </a>
                  </div>
                </div>

                <!-- Share Button -->
                <div class="pt-4 border-t-2 border-gray-200">
                  <button
                    type="button"
                    (click)="shareEpisode(episode)"
                    class="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-black py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 md:hover:scale-105">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                    </svg>
                    <span>Episode teilen</span>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Load More Section -->
        @if (episodes().length > 0 && hasMoreEpisodes()) {
          <div class="mt-16 text-center">
            <div class="bg-white rounded-2xl p-8 shadow-2xl border-4 border-green-600">
              <div class="text-5xl mb-4">🏟️</div>
              <p class="text-xl text-gray-700 font-bold mb-6">Noch mehr Episoden entdecken?</p>
              <button
                type="button"
                [disabled]="isLoading()"
                (click)="loadMoreEpisodes()"
                class="px-10 py-5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-lg font-black rounded-xl transition-all duration-300 md:hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                @if (isLoading()) {
                  <span class="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-white border-r-2 border-white border-b-2 border-transparent mr-2"></span>
                }
                ⚽ Weitere Episoden laden
              </button>
            </div>
          </div>
        }
      </main>

      <!-- Footer -->
      <footer class="relative z-10 bg-gradient-to-r from-green-800 to-green-900 border-t-4 border-yellow-400 py-8 mt-16">
        <div class="container mx-auto max-w-7xl px-4 md:px-8">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-sm text-white font-bold flex items-center gap-2">
              <span class="text-xl">⚽</span>
              © 2025 Schnittstellenpass | Zwischen Profis & Amateur
            </p>
            <div class="flex flex-wrap items-center justify-center gap-4 text-sm text-green-200">
              <a href="#" class="hover:text-yellow-400 transition-colors font-semibold">Datenschutz</a>
              <a href="#" class="hover:text-yellow-400 transition-colors font-semibold">Impressum</a>
              <a href="#" class="hover:text-yellow-400 transition-colors font-semibold">Kontakt</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .animation-delay-1000 {
      animation-delay: 0.3s;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class EpisodesComponent implements OnInit {
  private readonly spotifyService = inject(SpotifyService);

  // Episodes data
  protected episodes = signal<Episode[]>([]);
  protected isLoading = signal<boolean>(false);
  protected currentOffset = signal<number>(0);
  protected hasMoreEpisodes = signal<boolean>(true);

  ngOnInit(): void {
    this.loadEpisodes();
  }

  // Share episode
  protected shareEpisode(episode: Episode): void {
    const shareText = `🎙️ Hör dir diese Episode von Schnittstellenpass an: ${episode.title}\n\n` +
                     `⚽ Zwischen Profi & Amateur\n\n` +
                     `🎵 Spotify: ${episode.spotifyUrl}\n` +
                     `▶️ YouTube: ${episode.youtubeUrl}\n` +
                     `🎧 Apple Music: ${episode.appleMusicUrl}`;

    if (navigator.share) {
      navigator.share({
        title: episode.title,
        text: shareText,
        url: episode.spotifyUrl
      }).catch(() => {
        // Fallback: Copy to clipboard
        this.copyToClipboard(shareText);
      });
    } else {
      this.copyToClipboard(shareText);
    }
  }

  // Copy to clipboard helper
  private copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('Links kopiert! 🎉');
    });
  }

  /**
   * Load episodes from Spotify API
   */
  protected loadEpisodes(offset: number = 0): void {
    this.isLoading.set(true);

    // Fetch 5 episodes from Spotify
    this.spotifyService.getEpisodes(undefined, 5, offset).subscribe({
      next: (response) => {
        const newEpisodes = response.items.map((spotifyEpisode, index) => this.transformToEpisode(spotifyEpisode, offset + index + 1));

        if (offset === 0) {
          // First load - replace all episodes
          this.episodes.set(newEpisodes);
        } else {
          // Load more - append to existing episodes
          this.episodes.update(current => [...current, ...newEpisodes]);
        }

        // Update pagination state
        this.currentOffset.set(offset + response.items.length);
        this.hasMoreEpisodes.set(response.next !== null);
      },
      error: (error) => {
        console.error('Failed to fetch episodes:', error);
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Transform Spotify episode to component Episode model
   */
  private transformToEpisode(spotifyEpisode: SpotifyEpisode, episodeNumber: number): Episode {
    // YouTube and Apple Music URLs are not available from Spotify API
    // Using channel/podcast URLs as fallbacks
    const youtubeUrl = 'https://www.youtube.com/@schnittstellenpass1105';
    const appleMusicUrl = 'https://podcasts.apple.com/us/podcast/schnittstellenpass/id1234567890';

    // Format date from YYYY-MM-DD to DD.MM.YYYY
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };

    // Format duration from milliseconds to MM:SS or HH:MM:SS
    const formatDuration = (ms: number): string => {
      const seconds = Math.floor(ms / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (hours > 0) {
        const remainingMinutes = minutes % 60;
        const remainingSeconds = seconds % 60;
        return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      } else {
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
      }
    };

    // Strip HTML from description
    const stripHtml = (html: string): string => {
      const tmp = document.createElement('DIV');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    };

    return {
      id: spotifyEpisode.id,
      title: spotifyEpisode.name,
      date: formatDate(spotifyEpisode.release_date),
      duration: formatDuration(spotifyEpisode.duration_ms),
      episodeNumber: episodeNumber,
      thumbnail: spotifyEpisode.images?.[0]?.url,
      spotifyUrl: spotifyEpisode.external_urls?.spotify,
      youtubeUrl: youtubeUrl,
      appleMusicUrl: appleMusicUrl,
      description: stripHtml(spotifyEpisode.description)
    };
  }

  /**
   * Load more episodes
   */
  protected loadMoreEpisodes(): void {
    if (this.hasMoreEpisodes() && !this.isLoading()) {
      this.loadEpisodes(this.currentOffset());
    }
  }
}
