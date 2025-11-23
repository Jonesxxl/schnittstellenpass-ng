import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError, forkJoin, of } from 'rxjs';
import {
  SpotifyShow,
  SpotifyEpisode,
  SpotifyEpisodesResponse,
  SpotifyShowInfo,
  SpotifyError
} from './spotify.models';
import { environment } from '../../../environments/environment';

/**
 * Service to handle Spotify API calls for podcast/show information
 */
@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://api.spotify.com/v1';

  /**
   * Get the total number of episodes for a show
   * @param showId The Spotify show ID
   * @param accessToken Spotify API access token
   * @returns Observable with the total number of episodes
   */
  getEpisodeCount(showId: string, accessToken: string): Observable<number> {
    const headers = this.createAuthHeaders(accessToken);

    return this.http.get<SpotifyShow>(`${this.baseUrl}/shows/${showId}`, { headers }).pipe(
      map(show => show.total_episodes),
      catchError(this.handleError)
    );
  }

  /**
   * Get the latest episode of a show
   * @param showId The Spotify show ID
   * @param accessToken Spotify API access token
   * @returns Observable with the latest episode
   */
  getLatestEpisode(showId: string, accessToken: string): Observable<SpotifyEpisode | null> {
    const headers = this.createAuthHeaders(accessToken);
    const params = new HttpParams()
      .set('limit', '1')
      .set('offset', '0');

    return this.http.get<SpotifyEpisodesResponse>(`${this.baseUrl}/shows/${showId}/episodes`, { headers, params }).pipe(
      map(response => response.items.length > 0 ? response.items[0] : null),
      catchError(this.handleError)
    );
  }

  /**
   * Get show rating/popularity
   * Note: Spotify API doesn't provide user ratings. This returns the show's popularity score (0-100)
   * @param showId The Spotify show ID
   * @param accessToken Spotify API access token
   * @returns Observable with the popularity score (0-100) or null if unavailable
   */
  getShowRating(showId: string, accessToken: string): Observable<number | null> {
    const headers = this.createAuthHeaders(accessToken);

    return this.http.get<any>(`${this.baseUrl}/shows/${showId}`, { headers }).pipe(
      map(show => {
        // Spotify API may return a popularity field (0-100)
        // Note: Not all endpoints include this field
        return show.popularity !== undefined ? show.popularity : null;
      }),
      catchError(() => of(null))
    );
  }

  /**
   * Get comprehensive show information including episode count, latest episode, and rating
   * @param showId The Spotify show ID
   * @param accessToken Spotify API access token
   * @returns Observable with complete show information
   */
  getShowInfo(showId: string, accessToken: string): Observable<SpotifyShowInfo> {
    const headers = this.createAuthHeaders(accessToken);

    // Fetch show details and latest episode in parallel
    return forkJoin({
      show: this.http.get<SpotifyShow>(`${this.baseUrl}/shows/${showId}`, { headers }),
      latestEpisode: this.getLatestEpisode(showId, accessToken),
      rating: this.getShowRating(showId, accessToken)
    }).pipe(
      map(result => ({
        show: result.show,
        totalEpisodes: result.show.total_episodes,
        latestEpisode: result.latestEpisode,
        rating: result.rating
      })),
      catchError(this.handleError)
    );
  }

  /**
   * Get multiple episodes from a show
   * @param showId The Spotify show ID
   * @param accessToken Spotify API access token
   * @param limit Number of episodes to fetch (default: 10, max: 50)
   * @param offset Offset for pagination (default: 0)
   * @returns Observable with episodes response
   */
  getEpisodes(
    showId: string,
    accessToken: string,
    limit: number = 10,
    offset: number = 0
  ): Observable<SpotifyEpisodesResponse> {
    const headers = this.createAuthHeaders(accessToken);
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    return this.http.get<SpotifyEpisodesResponse>(`${this.baseUrl}/shows/${showId}/episodes`, { headers, params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Search for shows by name
   * @param query Search query
   * @param accessToken Spotify API access token
   * @param limit Number of results (default: 10)
   * @returns Observable with search results
   */
  searchShows(query: string, accessToken: string, limit: number = 10): Observable<SpotifyShow[]> {
    const headers = this.createAuthHeaders(accessToken);
    const params = new HttpParams()
      .set('q', query)
      .set('type', 'show')
      .set('limit', limit.toString());

    return this.http.get<any>(`${this.baseUrl}/search`, { headers, params }).pipe(
      map(response => response.shows?.items || []),
      catchError(this.handleError)
    );
  }

  /**
   * Create authorization headers with access token
   * @param accessToken Spotify API access token
   * @returns HttpHeaders with authorization
   */
  private createAuthHeaders(accessToken: string): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Handle HTTP errors
   * @param error The error response
   * @returns Observable that throws the error
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred while fetching data from Spotify API';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error && error.error.error) {
      // Spotify API error
      const spotifyError = error.error as SpotifyError;
      errorMessage = `Spotify API Error ${spotifyError.error.status}: ${spotifyError.error.message}`;
    } else if (error.status) {
      // HTTP error
      errorMessage = `HTTP Error ${error.status}: ${error.statusText}`;
    }

    console.error('Spotify API Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
