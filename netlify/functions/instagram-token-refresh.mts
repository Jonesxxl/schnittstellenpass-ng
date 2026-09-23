/**
 * Renews the Instagram access token once a week. Long-lived tokens expire
 * after 60 days and cannot be renewed once expired, so this keeps the feed
 * running without manual steps. A token must be at least 24 hours old to be
 * refreshed; a failed run is retried the following week.
 */
import { getCurrentToken, storeRefreshedToken } from '../lib/instagram-token.mts';

interface RefreshResponse {
  access_token: string;
  expires_in: number;
}

export default async (): Promise<void> => {
  const current = await getCurrentToken();
  if (!current) {
    console.warn('INSTAGRAM_ACCESS_TOKEN is not set, nothing to refresh');
    return;
  }

  const response = await fetch(
    `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(current.token)}`
  );
  if (!response.ok) {
    console.error(`Instagram token refresh failed with status ${response.status}`);
    return;
  }

  const { access_token, expires_in } = await response.json() as RefreshResponse;
  await storeRefreshedToken(access_token, expires_in, current.sourceHash);
  console.log(`Instagram token refreshed, valid for ${Math.round(expires_in / 86400)} days`);
};

export const config = {
  schedule: '@weekly'
};
