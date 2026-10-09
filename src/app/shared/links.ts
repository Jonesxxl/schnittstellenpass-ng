import { environment } from '../../environments/environment';

/** External profiles of the podcast */
export const LINKS = {
  spotify: `https://open.spotify.com/show/${environment.spotify.showId}`,
  applePodcasts: 'https://podcasts.apple.com/us/podcast/schnittstellenpass-zwischen-profi-und-amateur/id1561845736',
  youtube: 'https://www.youtube.com/@schnittstellenpass1105',
  instagram: 'https://www.instagram.com/schnittstellenpass/',
  // Feed of the podcast host (Spotify for Creators), read by Apple Podcasts and other apps
  rssFeed: 'https://anchor.fm/s/fead9f68/podcast/rss'
} as const;
