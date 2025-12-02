export const environment = {
  production: false,

  // Spotify API Credentials
  // Get these from: https://developer.spotify.com/dashboard
  // Follow the instructions in API_SETUP.md to create a Spotify app and get your credentials
  spotify: {
    // Replace these with your actual Spotify credentials for local development
    // 1. Go to https://developer.spotify.com/dashboard
    // 2. Log in and create a new app
    // 3. Copy the Client ID and Client Secret
    clientId: 'YOUR_SPOTIFY_CLIENT_ID', // Replace with your actual Client ID
    clientSecret: 'YOUR_SPOTIFY_CLIENT_SECRET', // Replace with your actual Client Secret
    showId: '4gpxvhJ8WyrGAnba5A6LQc' // Schnittstellenpass podcast show ID
  },

  // YouTube API Credentials
  // Get API Key from: https://console.cloud.google.com/
  youtube: {
    apiKey: 'YOUR_YOUTUBE_API_KEY',
    channelId: 'YOUR_CHANNEL_ID', // Or use playlistId
    playlistId: '' // Optional: specific playlist for podcast episodes
  },

  // Apple Podcasts
  // No API key needed, but you'll need your podcast ID and RSS feed URL
  applePodcasts: {
    podcastId: 'YOUR_APPLE_PODCAST_ID',
    rssFeedUrl: 'YOUR_PODCAST_RSS_FEED_URL'
  }
};
