import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

export interface InstagramPost {
  id: string;
  permalink: string;
  caption: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  timestamp: string;
  // Same-origin URL: images are served through the function, not by Instagram
  image: string;
}

@Injectable({ providedIn: 'root' })
export class InstagramFeedService {
  private readonly http = inject(HttpClient);

  // Netlify function (netlify/functions/instagram.mts) that holds the access token server-side
  private readonly feedUrl = '/.netlify/functions/instagram';

  /**
   * Latest posts of the Instagram account; empty if the feed cannot be loaded
   */
  getLatestPosts(): Observable<InstagramPost[]> {
    return this.http.get<{ posts: InstagramPost[] }>(this.feedUrl).pipe(
      map(response => response.posts),
      catchError(error => {
        console.error('Failed to fetch Instagram posts:', error);
        return of([]);
      })
    );
  }
}
