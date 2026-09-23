/**
 * Latest Instagram posts for the "Aus der Kabine" section.
 *
 *   GET /.netlify/functions/instagram             -> { posts: [...] } (the latest 4)
 *   GET /.netlify/functions/instagram?image=<id>  -> image of one post
 *
 * Images are served through this function as well, so visitors never load
 * anything from Instagram's servers. That also sidesteps Instagram's signed
 * image URLs, which expire after about a day. Only media of the connected
 * account can be requested: the Graph API rejects foreign ids for this token.
 *
 * Environment variable (scope must include Functions): INSTAGRAM_ACCESS_TOKEN
 */
import { getCurrentToken } from '../lib/instagram-token.mts';

const GRAPH_API = 'https://graph.instagram.com';
const POST_COUNT = 4;
const CAPTION_LENGTH = 200;

interface InstagramMedia {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

function jsonResponse(body: unknown, status: number, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers }
  });
}

/**
 * Browser and Netlify CDN caching, so page views do not hit the Instagram API
 */
function cacheHeaders(browserSeconds: number, cdnSeconds: number): Record<string, string> {
  return {
    'Cache-Control': `public, max-age=${browserSeconds}`,
    'Netlify-CDN-Cache-Control': `public, durable, s-maxage=${cdnSeconds}, stale-while-revalidate=86400`
  };
}

/**
 * Picture of a post: videos and reels only have a still in thumbnail_url
 */
function pictureUrl(media: Pick<InstagramMedia, 'media_type' | 'media_url' | 'thumbnail_url'>): string | undefined {
  return media.media_type === 'VIDEO' ? media.thumbnail_url : media.media_url;
}

/**
 * Caption on one line, shortened by characters so emoji are not cut in half
 */
function shortCaption(caption = ''): string {
  const characters = Array.from(caption.replace(/\s+/g, ' ').trim());
  return characters.length > CAPTION_LENGTH ? `${characters.slice(0, CAPTION_LENGTH - 1).join('').trimEnd()}…` : characters.join('');
}

function graphRequest(path: string, token: string): Promise<Response> {
  const separator = path.includes('?') ? '&' : '?';
  return fetch(`${GRAPH_API}${path}${separator}access_token=${encodeURIComponent(token)}`);
}

async function latestPosts(token: string): Promise<Response> {
  // Ask for a few more in case a post has no picture (e.g. a reel without cover)
  const response = await graphRequest(
    `/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=${POST_COUNT * 2}`,
    token
  );
  if (!response.ok) {
    console.error(`Instagram media request failed with status ${response.status}`);
    return jsonResponse({ error: 'Instagram request failed' }, 502);
  }

  const { data = [] } = await response.json() as { data?: InstagramMedia[] };
  const posts = data
    .filter(media => pictureUrl(media))
    .slice(0, POST_COUNT)
    .map(media => ({
      id: media.id,
      permalink: media.permalink,
      caption: shortCaption(media.caption),
      mediaType: media.media_type,
      timestamp: media.timestamp,
      image: `/.netlify/functions/instagram?image=${media.id}`
    }));

  return jsonResponse({ posts }, 200, cacheHeaders(300, 900));
}

async function postImage(token: string, id: string): Promise<Response> {
  if (!/^\d{1,30}$/.test(id)) {
    return jsonResponse({ error: 'Invalid image id' }, 400);
  }

  const mediaResponse = await graphRequest(`/${id}?fields=media_type,media_url,thumbnail_url`, token);
  if (!mediaResponse.ok) {
    // Unknown id, deleted post or media of another account
    return jsonResponse({ error: 'Image not found' }, 404);
  }
  const source = pictureUrl(await mediaResponse.json() as InstagramMedia);
  if (!source || !source.startsWith('https://')) {
    return jsonResponse({ error: 'Image not found' }, 404);
  }

  const image = await fetch(source);
  const contentType = image.headers.get('content-type') ?? '';
  // Never serve anything but images from this origin
  if (!image.ok || !contentType.startsWith('image/')) {
    console.error(`Instagram image download failed with status ${image.status} (${contentType || 'no content type'})`);
    return jsonResponse({ error: 'Instagram request failed' }, 502);
  }

  return new Response(image.body, {
    status: 200,
    headers: { 'Content-Type': contentType, 'X-Content-Type-Options': 'nosniff', ...cacheHeaders(86400, 604800) }
  });
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, 405, { 'Allow': 'GET' });
  }

  const current = await getCurrentToken();
  if (!current) {
    console.error('INSTAGRAM_ACCESS_TOKEN must be set');
    return jsonResponse({ error: 'Instagram is not configured' }, 503);
  }

  try {
    const imageId = new URL(req.url).searchParams.get('image');
    return imageId === null ? await latestPosts(current.token) : await postImage(current.token, imageId);
  } catch (error) {
    console.error('Instagram proxy error:', error);
    return jsonResponse({ error: 'Instagram request failed' }, 502);
  }
};
