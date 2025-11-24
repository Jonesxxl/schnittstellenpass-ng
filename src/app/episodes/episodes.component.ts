import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Episode {
  id: string;
  platform: 'Spotify' | 'YouTube' | 'Apple Podcasts';
  title: string;
  date: string;
  duration: string;
  episodeNumber: number;
  thumbnail?: string;
  url: string;
}

@Component({
  selector: 'app-episodes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Episodes Section mit Fußballfeld-Ästhetik -->
    <div class="relative min-h-screen bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 overflow-hidden">

      <!-- Fußballfeld-Grid Overlay -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute inset-0 grid grid-cols-6 grid-rows-6">
          @for (i of gridLines(); track i) {
            <div class="border border-white/30"></div>
          }
        </div>
        <!-- Mittelkreis -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-white/30 rounded-full"></div>
      </div>

      <!-- Main Content -->
      <main class="relative z-10 container mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24">

        <!-- Page Header -->
        <div class="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-8 md:p-12 shadow-2xl mb-12">
          <div class="flex items-center gap-4 mb-4">
            <div class="text-5xl" aria-hidden="true">📻</div>
            <div>
              <h1 class="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">EPISODEN LOG</h1>
              <p class="text-lg text-gray-700 font-medium mt-2">Die letzten 5 Folgen von allen Plattformen</p>
            </div>
          </div>

          <!-- Platform Filter Badges -->
          <div class="flex flex-wrap gap-3 mt-6">
            @for (platform of platforms(); track platform.id) {
              <button
                type="button"
                (click)="filterByPlatform(platform.name)"
                [class]="selectedPlatform() === platform.name ?
                  'px-4 py-2 backdrop-blur-md bg-white/40 border-2 border-white/60 rounded-xl font-bold text-gray-900 transition-all shadow-lg' :
                  'px-4 py-2 backdrop-blur-md bg-white/10 border border-white/30 rounded-xl font-semibold text-gray-700 hover:bg-white/20 transition-all'"
                [attr.aria-label]="'Filter nach ' + platform.name">
                {{ platform.icon }} {{ platform.name }}
              </button>
            }
          </div>
        </div>

        <!-- Episodes Retro Log -->
        <div class="space-y-6">
          @for (episode of filteredEpisodes(); track episode.id; let i = $index) {
            <div
              class="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group"
              [class.animation-delay-1000]="i % 2 === 1">

              <!-- Episode Header -->
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <!-- Platform Badge & Episode Number -->
                <div class="flex items-center gap-3">
                  <div class="px-4 py-2 rounded-xl font-black text-sm shadow-md text-white"
                    [ngClass]="{
                      'bg-green-500/80': episode.platform === 'Spotify',
                      'bg-red-500/80': episode.platform === 'YouTube',
                      'bg-purple-500/80': episode.platform === 'Apple Podcasts'
                    }">
                    {{ getPlatformIcon(episode.platform) }} {{ episode.platform }}
                  </div>
                  <div class="backdrop-blur-sm bg-white/30 border border-white/40 px-3 py-1.5 rounded-lg">
                    <span class="text-xs font-black text-gray-800">#{{ episode.episodeNumber }}</span>
                  </div>
                </div>

                <!-- Date & Duration -->
                <div class="flex items-center gap-4 text-sm text-gray-700">
                  <div class="flex items-center gap-1.5">
                    <span class="text-lg">📅</span>
                    <span class="font-semibold">{{ episode.date }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="text-lg">⏱️</span>
                    <span class="font-semibold">{{ episode.duration }}</span>
                  </div>
                </div>
              </div>

              <!-- Episode Title -->
              <h2 class="text-2xl md:text-3xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {{ episode.title }}
              </h2>

              <!-- Retro Terminal-Style Log Entry -->
              <div class="backdrop-blur-sm bg-gray-900/80 border border-white/20 rounded-xl p-4 font-mono text-sm mb-4">
                <div class="text-green-400 space-y-1">
                  <div><span class="text-gray-500">$</span> schnittstellenpass --episode {{ episode.episodeNumber }}</div>
                  <div><span class="text-blue-400">[INFO]</span> Loading episode: "{{ episode.title }}"</div>
                  <div><span class="text-yellow-400">[LOG]</span> Platform: {{ episode.platform }}</div>
                  <div><span class="text-yellow-400">[LOG]</span> Published: {{ episode.date }}</div>
                  <div><span class="text-yellow-400">[LOG]</span> Duration: {{ episode.duration }}</div>
                  <div><span class="text-green-400">[SUCCESS]</span> Episode ready to play! 🎧</div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-3">
                <button
                  type="button"
                  (click)="playEpisode(episode.url)"
                  class="group/btn relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
                  aria-label="Episode abspielen">
                  <span class="relative z-10 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                    </svg>
                    Jetzt anhören
                  </span>
                  <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                </button>

                <button
                  type="button"
                  (click)="shareEpisode(episode)"
                  class="px-6 py-3 backdrop-blur-md bg-white/30 border border-white/40 text-gray-900 font-bold rounded-xl hover:bg-white/50 transition-all duration-300 hover:scale-105 shadow-md focus:outline-none focus:ring-4 focus:ring-gray-300"
                  aria-label="Episode teilen">
                  🔗 Teilen
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Load More Section -->
        <div class="mt-12 text-center">
          <div class="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-8 shadow-xl">
            <p class="text-gray-700 font-semibold mb-4">Mehr Episoden entdecken?</p>
            <button
              type="button"
              (click)="loadMoreEpisodes()"
              class="px-8 py-4 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-400">
              Weitere Episoden laden
            </button>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="relative z-10 backdrop-blur-md bg-white/10 border-t border-white/20 py-8">
        <div class="container mx-auto max-w-7xl px-4 md:px-8">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-sm text-gray-700 font-medium">
              © 2025 Schnittstellenpass | Zwischen Profis & Amateur
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
export class EpisodesComponent {
  // Grid lines for football field
  protected gridLines = signal(Array.from({ length: 36 }, (_, i) => i));

  // Selected platform filter
  protected selectedPlatform = signal<string | null>(null);

  // Platforms
  protected platforms = signal([
    { id: '1', name: 'Alle', icon: '📻' },
    { id: '2', name: 'Spotify', icon: '🎵' },
    { id: '3', name: 'YouTube', icon: '▶️' },
    { id: '4', name: 'Apple Podcasts', icon: '🎧' }
  ]);

  // Mock Episodes Data (letzte 5 Folgen)
  protected episodes = signal<Episode[]>([
    {
      id: '1',
      platform: 'Spotify',
      title: 'Taktikanalyse: Die Evolution des Gegenpressings im modernen Fußball',
      date: '15.11.2025',
      duration: '52:34',
      episodeNumber: 47,
      url: 'https://open.spotify.com/show/4gpxvhJ8WyrGAnba5A6LQc'
    },
    {
      id: '2',
      platform: 'YouTube',
      title: 'Interview Special: Von der Kreisliga zur Regionalliga - Eine Reise',
      date: '08.11.2025',
      duration: '1:15:22',
      episodeNumber: 46,
      url: 'https://www.youtube.com/@schnittstellenpass1105'
    },
    {
      id: '3',
      platform: 'Apple Podcasts',
      title: 'Trainerwechsel: Wann ist der richtige Zeitpunkt?',
      date: '01.11.2025',
      duration: '48:19',
      episodeNumber: 45,
      url: 'https://podcasts.apple.com/us/search?term=schnittstellenpass'
    },
    {
      id: '4',
      platform: 'Spotify',
      title: 'Spieleranalyse: Die besten Mittelfeldspieler der Bundesliga',
      date: '25.10.2025',
      duration: '56:41',
      episodeNumber: 44,
      url: 'https://open.spotify.com/show/4gpxvhJ8WyrGAnba5A6LQc'
    },
    {
      id: '5',
      platform: 'YouTube',
      title: 'Amateur vs. Profi: Unterschiede in der Saisonvorbereitung',
      date: '18.10.2025',
      duration: '1:02:15',
      episodeNumber: 43,
      url: 'https://www.youtube.com/@schnittstellenpass1105'
    }
  ]);

  // Filtered episodes based on platform selection
  protected filteredEpisodes = signal<Episode[]>(this.episodes());

  // Filter by platform
  protected filterByPlatform(platform: string): void {
    this.selectedPlatform.set(platform);

    if (platform === 'Alle' || platform === null) {
      this.filteredEpisodes.set(this.episodes());
    } else {
      const filtered = this.episodes().filter(ep => ep.platform === platform);
      this.filteredEpisodes.set(filtered);
    }
  }

  // Get platform icon
  protected getPlatformIcon(platform: string): string {
    switch (platform) {
      case 'Spotify': return '🎵';
      case 'YouTube': return '▶️';
      case 'Apple Podcasts': return '🎧';
      default: return '📻';
    }
  }

  // Play episode
  protected playEpisode(url: string): void {
    window.open(url, '_blank');
  }

  // Share episode
  protected shareEpisode(episode: Episode): void {
    if (navigator.share) {
      navigator.share({
        title: episode.title,
        text: `Hör dir diese Episode von Schnittstellenpass an: ${episode.title}`,
        url: episode.url
      }).catch(() => {
        // Fallback: Copy to clipboard
        this.copyToClipboard(episode.url);
      });
    } else {
      this.copyToClipboard(episode.url);
    }
  }

  // Copy to clipboard helper
  private copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link kopiert! 🎉');
    });
  }

  // Load more episodes
  protected loadMoreEpisodes(): void {
    alert('Weitere Episoden werden geladen... 🎧');
    // Here you would typically load more episodes from an API
  }
}
