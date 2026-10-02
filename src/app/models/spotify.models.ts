/**
 * Spotify API Models
 * Interfaces for Spotify Web API responses
 */

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
  // Spotify returns null for episodes that are not available in the market
  items: (SpotifyEpisode | null)[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

// Application Episode Model (transformed from Spotify)
export interface Episode {
  id: string;
  // Title without the "Saison 4 Folge #8" part, which is moved into code
  title: string;
  // Short episode code such as "S4 · 8", if the title contains one
  code: string | null;
  description: string;
  date: string;
  duration: string;
  spotifyUrl: string;
  imageUrl: string;
  audioPreviewUrl: string | null;
}
