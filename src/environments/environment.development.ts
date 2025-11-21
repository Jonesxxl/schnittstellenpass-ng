/**
 * Development environment configuration
 */
export const environment = {
  production: false,
  spotify: {
    clientId: 'YOUR_SPOTIFY_CLIENT_ID',
    clientSecret: 'YOUR_SPOTIFY_CLIENT_SECRET',
    // Note: For client-side apps, use PKCE flow instead of client credentials
    // This is a placeholder - implement proper authentication flow
    redirectUri: 'http://localhost:4200/callback'
  }
};
