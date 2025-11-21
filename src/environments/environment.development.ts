export const environment = {
  production: false,

  // Spotify API Credentials
  // Get these from: <a href ="https://developer.spotify.com/dashboard">
  spotify: {
    clientId: 'YOUR_SPOTIFY_CLIENT_ID',
    clientSecret: 'YOUR_SPOTIFY_CLIENT_SECRET',
    showId: 'YOUR_PODCAST_SHOW_ID' // Extract from your podcast URL
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
