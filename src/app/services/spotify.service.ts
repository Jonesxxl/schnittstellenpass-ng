import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import {
  SpotifyAuthToken,
  SpotifyShow,
  SpotifyEpisode,
  SpotifyEpisodesResponse,
  Episode,
  ShowStats
} from '../models/spotify.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private readonly http = inject(HttpClient);

  private readonly SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
  private readonly SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';

  private accessToken$ = new BehaviorSubject<string | null>(null);
  private tokenExpiry: number = 0;

  /**
   * Get Spotify access token using Client Credentials flow
   */
  private getAccessToken(): Observable<string> {
    // Check if token is still valid
    if (this.accessToken$.value && Date.now() < this.tokenExpiry) {
      return of(this.accessToken$.value);
    }

    const clientId = environment.spotify.clientId;
    const clientSecret = environment.spotify.clientSecret;

    if (!clientId || !clientSecret) {
      console.error('Spotify credentials not configured');
      return throwError(() => new Error('Spotify credentials not configured'));
    }

    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`)
    });

    return this.http.post<SpotifyAuthToken>(this.SPOTIFY_AUTH_URL, body.toString(), { headers }).pipe(
      tap(response => {
        this.accessToken$.next(response.access_token);
        // Set expiry time (subtract 5 minutes for safety)
        this.tokenExpiry = Date.now() + (response.expires_in - 300) * 1000;
      }),
      map(response => response.access_token),
      catchError(error => {
        console.error('Failed to get Spotify access token:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create authenticated headers for Spotify API requests
   */
  private createAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Get podcast show details
   */
  getShow(showId?: string): Observable<SpotifyShow> {
    const id = showId || environment.spotify.showId;

    if (!id) {
      return throwError(() => new Error('Show ID not configured'));
    }

    return this.getAccessToken().pipe(
      switchMap(token => {
        const headers = this.createAuthHeaders(token);
        return this.http.get<SpotifyShow>(
          `${this.SPOTIFY_API_BASE}/shows/${id}`,
          { headers }
        );
      }),
      catchError(error => {
        console.error('Failed to fetch show details:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get podcast episodes
   */
  getEpisodes(showId?: string, limit: number = 10, offset: number = 0): Observable<SpotifyEpisodesResponse> {
    const id = showId || environment.spotify.showId;

    if (!id) {
      return throwError(() => new Error('Show ID not configured'));
    }

    return this.getAccessToken().pipe(
      switchMap(token => {
        const headers = this.createAuthHeaders(token);
        return this.http.get<SpotifyEpisodesResponse>(
          `${this.SPOTIFY_API_BASE}/shows/${id}/episodes?limit=${limit}&offset=${offset}`,
          { headers }
        );
      }),
      catchError(error => {
        console.error('Failed to fetch episodes:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get latest episode
   */
  getLatestEpisode(showId?: string): Observable<Episode | null> {
    return this.getEpisodes(showId, 1, 0).pipe(
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
   * Get show statistics
   */
  getShowStats(showId?: string): Observable<ShowStats> {
    return this.getShow(showId).pipe(
      map(show => ({
        totalEpisodes: show.total_episodes,
        rating: 4.9, // Spotify API doesn't provide ratings, using hardcoded value
        listeners: '10K+' // Spotify API doesn't provide listener count, using hardcoded value
      })),
      catchError(() => of({
        totalEpisodes: 0,
        rating: 4.9,
        listeners: '10K+'
      }))
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

  /**
   * Open Spotify URL in new tab
   */
  openSpotify(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Get show Spotify URL
   */
  getShowUrl(showId?: string): Observable<string> {
    return this.getShow(showId).pipe(
      map(show => show.external_urls.spotify),
      catchError(() => of(`https://open.spotify.com/show/${showId || environment.spotify.showId}`))
    );
  }
}
