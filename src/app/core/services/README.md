# Spotify Service Documentation

## Overview

The Spotify Service provides methods to interact with the Spotify Web API to retrieve podcast/show information, including episode counts, latest episodes, and popularity ratings.

## Prerequisites

1. **Spotify Developer Account**: Create an app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. **API Credentials**: Obtain your Client ID and Client Secret
3. **Authentication**: Implement OAuth 2.0 flow to get access tokens

## Configuration

Update the environment files with your Spotify credentials:

### Development (`src/environments/environment.development.ts`)
```typescript
export const environment = {
  production: false,
  spotify: {
    clientId: 'your_client_id',
    clientSecret: 'your_client_secret',
    redirectUri: 'http://localhost:4200/callback'
  }
};
```

### Production (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: true,
  spotify: {
    clientId: 'your_client_id',
    clientSecret: 'your_client_secret',
    redirectUri: 'https://your-domain.com/callback'
  }
};
```

## Usage

### Injecting the Service

```typescript
import { Component, inject } from '@angular/core';
import { SpotifyService } from './core/services/spotify.service';

@Component({
  selector: 'app-example',
  template: `...`
})
export class ExampleComponent {
  private spotifyService = inject(SpotifyService);
}
```

### Getting Episode Count

```typescript
const showId = '4rOoJ6Egrf8K2IrywzwOMk'; // Example show ID
const accessToken = 'your_access_token';

this.spotifyService.getEpisodeCount(showId, accessToken).subscribe({
  next: (count) => console.log(`Total episodes: ${count}`),
  error: (error) => console.error('Error:', error)
});
```

### Getting Latest Episode

```typescript
this.spotifyService.getLatestEpisode(showId, accessToken).subscribe({
  next: (episode) => {
    if (episode) {
      console.log('Latest episode:', episode.name);
      console.log('Release date:', episode.release_date);
    }
  },
  error: (error) => console.error('Error:', error)
});
```

### Getting Show Rating (Popularity)

```typescript
this.spotifyService.getShowRating(showId, accessToken).subscribe({
  next: (rating) => {
    if (rating !== null) {
      console.log(`Show popularity: ${rating}/100`);
    }
  },
  error: (error) => console.error('Error:', error)
});
```

### Getting Complete Show Info

```typescript
this.spotifyService.getShowInfo(showId, accessToken).subscribe({
  next: (info) => {
    console.log('Show:', info.show.name);
    console.log('Total episodes:', info.totalEpisodes);
    console.log('Latest episode:', info.latestEpisode?.name);
    console.log('Popularity:', info.rating);
  },
  error: (error) => console.error('Error:', error)
});
```

### Getting Multiple Episodes

```typescript
this.spotifyService.getEpisodes(showId, accessToken, 10, 0).subscribe({
  next: (response) => {
    console.log('Episodes:', response.items);
    console.log('Total available:', response.total);
  },
  error: (error) => console.error('Error:', error)
});
```

### Searching for Shows

```typescript
this.spotifyService.searchShows('podcast name', accessToken, 5).subscribe({
  next: (shows) => {
    shows.forEach(show => {
      console.log(`${show.name} by ${show.publisher}`);
    });
  },
  error: (error) => console.error('Error:', error)
});
```

## API Methods

### `getEpisodeCount(showId: string, accessToken: string): Observable<number>`
Returns the total number of episodes for a show.

### `getLatestEpisode(showId: string, accessToken: string): Observable<SpotifyEpisode | null>`
Returns the most recent episode of a show.

### `getShowRating(showId: string, accessToken: string): Observable<number | null>`
Returns the show's popularity score (0-100). Note: Spotify doesn't provide user ratings, so this uses the popularity metric.

### `getShowInfo(showId: string, accessToken: string): Observable<SpotifyShowInfo>`
Returns comprehensive information including show details, episode count, latest episode, and rating.

### `getEpisodes(showId: string, accessToken: string, limit?: number, offset?: number): Observable<SpotifyEpisodesResponse>`
Returns a paginated list of episodes.

### `searchShows(query: string, accessToken: string, limit?: number): Observable<SpotifyShow[]>`
Searches for shows by name.

## Authentication

**Important**: The service requires a valid Spotify access token for all API calls. You need to implement authentication separately using one of these methods:

1. **Authorization Code with PKCE** (Recommended for client-side apps)
2. **Client Credentials Flow** (For server-side apps without user data)

Example authentication service structure:

```typescript
@Injectable({ providedIn: 'root' })
export class SpotifyAuthService {
  // Implement OAuth 2.0 flow
  getAccessToken(): Observable<string> {
    // Your authentication logic here
  }
}
```

## Models

All TypeScript interfaces are defined in `spotify.models.ts`:

- `SpotifyShow`: Show/podcast information
- `SpotifyEpisode`: Episode details
- `SpotifyEpisodesResponse`: Paginated episode list
- `SpotifyShowInfo`: Aggregated show information
- `SpotifyImage`: Image metadata
- `SpotifyError`: Error response structure

## Error Handling

The service includes comprehensive error handling:
- Client-side errors
- Spotify API errors
- HTTP errors

All errors are logged to the console and thrown as observables that can be caught in your components.

## Notes

1. **Rating Limitation**: Spotify's Web API doesn't provide user ratings or review scores. The `getShowRating()` method returns the popularity metric (0-100) as an alternative.

2. **Rate Limiting**: Spotify API has rate limits. Implement appropriate caching and request throttling in your application.

3. **Access Tokens**: Tokens expire after 1 hour. Implement token refresh logic in your authentication service.

4. **Show ID**: You can find show IDs in Spotify URLs or through the search API.

## Resources

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [Spotify API Console](https://developer.spotify.com/console/)
- [OAuth 2.0 PKCE Flow](https://developer.spotify.com/documentation/general/guides/authorization/code-flow/)
