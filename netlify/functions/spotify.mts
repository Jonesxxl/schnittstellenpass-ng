/**
 * Server-side proxy for the Spotify Web API.
 *
 * Spotify's Client Credentials flow needs the client secret, which must never
 * reach the browser. This function requests the access token on the server and
 * forwards only the read-only request the site needs. The show is fixed here,
 * so the function cannot be used to query arbitrary Spotify resources.
 *
 *   GET /.netlify/functions/spotify?resource=episodes&limit=5&offset=0
 *
 * Environment variables (Netlify site settings, scope must include Functions):
 *   SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_SHOW_ID (optional)
 */

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const DEFAULT_SHOW_ID = '4gpxvhJ8WyrGAnba5A6LQc';

// Spotify caps the page size of the episodes endpoint at 50.
const MAX_EPISODE_LIMIT = 50;

// Kept across warm invocations of the same function instance.
let cachedToken: { value: string; expiresAt: number } | null = null;

interface SpotifyAuthToken {
  access_token: string;
  expires_in: number;
}

/**
 * Get an access token, reusing the cached one until shortly before it expires
 */
async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const response = await fetch(SPOTIFY_AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`)
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error(`Spotify token request failed with status ${response.status}`);
  }

  const token = await response.json() as SpotifyAuthToken;
  // Refresh 5 minutes before the token actually expires
  cachedToken = {
    value: token.access_token,
    expiresAt: Date.now() + (token.expires_in - 300) * 1000
  };
  return cachedToken.value;
}

/**
 * Parse a non-negative integer query parameter; returns null if it is invalid
 */
function parseIntParam(value: string | null, fallback: number, min: number, max: number): number | null {
  if (value === null) {
    return fallback;
  }
  if (!/^\d{1,6}$/.test(value)) {
    return null;
  }
  const parsed = Number(value);
  return parsed >= min && parsed <= max ? parsed : null;
}

function jsonResponse(body: unknown, status: number, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers }
  });
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, 405, { 'Allow': 'GET' });
  }

  const clientId = process.env['SPOTIFY_CLIENT_ID'];
  const clientSecret = process.env['SPOTIFY_CLIENT_SECRET'];
  if (!clientId || !clientSecret) {
    console.error('SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set');
    return jsonResponse({ error: 'Spotify is not configured' }, 500);
  }
  const showId = encodeURIComponent(process.env['SPOTIFY_SHOW_ID'] || DEFAULT_SHOW_ID);

  const params = new URL(req.url).searchParams;
  let path: string;
  switch (params.get('resource')) {
    case 'episodes': {
      const limit = parseIntParam(params.get('limit'), 10, 1, MAX_EPISODE_LIMIT);
      const offset = parseIntParam(params.get('offset'), 0, 0, 999_999);
      if (limit === null || offset === null) {
        return jsonResponse({ error: 'Invalid limit or offset' }, 400);
      }
      path = `/shows/${showId}/episodes?limit=${limit}&offset=${offset}`;
      break;
    }
    default:
      return jsonResponse({ error: 'Unknown resource' }, 400);
  }

  try {
    const token = await getAccessToken(clientId, clientSecret);
    const response = await fetch(`${SPOTIFY_API_BASE}${path}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      // A revoked or prematurely expired token must not be reused
      if (response.status === 401) {
        cachedToken = null;
      }
      console.error(`Spotify request ${path} failed with status ${response.status}`);
      return jsonResponse({ error: 'Spotify request failed' }, 502);
    }

    return new Response(await response.text(), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    });
  } catch (error) {
    console.error('Spotify proxy error:', error);
    return jsonResponse({ error: 'Spotify request failed' }, 502);
  }
};
