/**
 * Long-lived Instagram access token shared by the Instagram functions.
 *
 * The initial token comes from the INSTAGRAM_ACCESS_TOKEN environment variable.
 * Tokens expire after 60 days, so the scheduled function instagram-token-refresh
 * renews it weekly and keeps the result in Netlify Blobs. Each stored token
 * remembers which environment token it descends from: setting a new
 * INSTAGRAM_ACCESS_TOKEN therefore always takes precedence over older refreshes.
 */
import { createHash } from 'node:crypto';
import { getStore } from '@netlify/blobs';

const STORE_NAME = 'instagram';
const TOKEN_KEY = 'access-token';

interface StoredToken {
  token: string;
  expiresAt: number;
  sourceHash: string;
}

export interface CurrentToken {
  token: string;
  sourceHash: string;
}

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function isStoredToken(value: unknown): value is StoredToken {
  const candidate = value as Partial<StoredToken> | null;
  return typeof candidate?.token === 'string'
    && typeof candidate.expiresAt === 'number'
    && typeof candidate.sourceHash === 'string';
}

async function readStoredToken(): Promise<StoredToken | null> {
  try {
    const value: unknown = await getStore(STORE_NAME).get(TOKEN_KEY, { type: 'json' });
    return isStoredToken(value) ? value : null;
  } catch (error) {
    console.error('Reading the stored Instagram token failed:', error);
    return null;
  }
}

/**
 * The token to use right now, or null if none is configured
 */
export async function getCurrentToken(): Promise<CurrentToken | null> {
  const envToken = process.env['INSTAGRAM_ACCESS_TOKEN'];
  if (!envToken) {
    return null;
  }
  const envHash = hash(envToken);
  const stored = await readStoredToken();
  if (stored && stored.sourceHash === envHash && stored.expiresAt > Date.now()) {
    return { token: stored.token, sourceHash: envHash };
  }
  return { token: envToken, sourceHash: envHash };
}

export async function storeRefreshedToken(token: string, expiresInSeconds: number, sourceHash: string): Promise<void> {
  const value: StoredToken = { token, expiresAt: Date.now() + expiresInSeconds * 1000, sourceHash };
  await getStore(STORE_NAME).setJSON(TOKEN_KEY, value);
}
