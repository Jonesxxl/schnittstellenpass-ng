/**
 * Spotify API Models and Interfaces
 */

/**
 * Represents a Spotify show (podcast)
 */
export interface SpotifyShow {
  id: string;
  name: string;
  description: string;
  publisher: string;
  images: SpotifyImage[];
  total_episodes: number;
  uri: string;
  external_urls: {
    spotify: string;
  };
}

/**
 * Represents a Spotify episode
 */
export interface SpotifyEpisode {
  id: string;
  name: string;
  description: string;
  release_date: string;
  duration_ms: number;
  images: SpotifyImage[];
  uri: string;
  external_urls: {
    spotify: string;
  };
  audio_preview_url?: string;
}

/**
 * Represents an image from Spotify
 */
export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

/**
 * Response from Spotify API when fetching show episodes
 */
export interface SpotifyEpisodesResponse {
  items: SpotifyEpisode[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

/**
 * Aggregated show information including episode details
 */
export interface SpotifyShowInfo {
  show: SpotifyShow;
  totalEpisodes: number;
  latestEpisode: SpotifyEpisode | null;
  rating: number | null;
}

/**
 * Spotify API error response
 */
export interface SpotifyError {
  error: {
    status: number;
    message: string;
  };
}
