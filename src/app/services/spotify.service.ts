import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SpotifyEpisode, SpotifyEpisodesResponse, Episode } from '../models/spotify.models';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private readonly http = inject(HttpClient);

  // Netlify function (netlify/functions/spotify.mts) that holds the Spotify
  // credentials server-side and forwards requests for the configured show
  private readonly SPOTIFY_PROXY_URL = '/.netlify/functions/spotify';

  /**
   * Get podcast episodes
   */
  getEpisodes(limit: number = 10, offset: number = 0): Observable<SpotifyEpisodesResponse> {
    return this.http.get<SpotifyEpisodesResponse>(this.SPOTIFY_PROXY_URL, {
      params: { resource: 'episodes', limit, offset }
    }).pipe(
      catchError(error => {
        console.error('Failed to fetch episodes:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get latest episode
   */
  getLatestEpisode(): Observable<Episode | null> {
    return this.getEpisodes(1, 0).pipe(
      map(response => {
        if (response.items.length === 0) {
          return null;
        }
        return this.transformSpotifyEpisode(response.items[0]);
      }),
      catchError(() => of(null))
    );
  }

  /**
   * Transform Spotify episode to application Episode model
   */
  private transformSpotifyEpisode(spotifyEpisode: SpotifyEpisode): Episode {
    return {
      id: spotifyEpisode.id,
      title: spotifyEpisode.name,
      description: this.stripHtml(spotifyEpisode.description),
      date: this.formatDate(spotifyEpisode.release_date),
      duration: this.formatDuration(spotifyEpisode.duration_ms),
      spotifyUrl: spotifyEpisode.external_urls.spotify,
      imageUrl: spotifyEpisode.images[0]?.url || '',
      audioPreviewUrl: spotifyEpisode.audio_preview_url
    };
  }

  /**
   * Strip HTML tags from description
   */
  private stripHtml(html: string): string {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  /**
   * Format date from YYYY-MM-DD to DD.MM.YYYY
   */
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  /**
   * Format duration from milliseconds to MM:SS or HH:MM:SS
   */
  private formatDuration(ms: number): string {
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
  }
}
