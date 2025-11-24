/**
 * Spotify API Models
 * Interfaces for Spotify Web API responses
 */

// Spotify Authentication Token Response
export interface SpotifyAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Spotify Show (Podcast) Response
export interface SpotifyShow {
  id: string;
  name: string;
  description: string;
  publisher: string;
  images: SpotifyImage[];
  external_urls: {
    spotify: string;
  };
  total_episodes: number;
  languages: string[];
  media_type: string;
  explicit: boolean;
}

// Spotify Episode Response
export interface SpotifyEpisode {
  id: string;
  name: string;
  description: string;
  release_date: string;
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
  images: SpotifyImage[];
  audio_preview_url: string | null;
  html_description: string;
  language: string;
  explicit: boolean;
}

// Spotify Image Object
export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

// Spotify Episodes List Response
export interface SpotifyEpisodesResponse {
  items: SpotifyEpisode[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

// Application Episode Model (transformed from Spotify)
export interface Episode {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  spotifyUrl: string;
  imageUrl: string;
  audioPreviewUrl: string | null;
}

// Application Show Statistics
export interface ShowStats {
  totalEpisodes: number;
  rating: number;
  listeners: string;
}
