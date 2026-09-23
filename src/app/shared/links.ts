import { environment } from '../../environments/environment';

/** External profiles of the podcast */
export const LINKS = {
  spotify: `https://open.spotify.com/show/${environment.spotify.showId}`,
  applePodcasts: 'https://podcasts.apple.com/us/podcast/schnittstellenpass-zwischen-profi-und-amateur/id1561845736',
  youtube: 'https://www.youtube.com/@schnittstellenpass1105',
  instagram: 'https://www.instagram.com/schnittstellenpass/'
} as const;
