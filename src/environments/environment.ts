export const environment = {
  production: true,

  // IMPORTANT: For production, use environment variables from your hosting platform
  // Never commit real API keys to git!
  //
  // For Netlify/Vercel: Use environment variables in build settings
  // For Firebase: Use firebase functions config
  // For custom server: Use process.env

  spotify: {
    clientId: 'SPOTIFY_CLIENT_ID', // Set via build environment variable
    clientSecret: 'SPOTIFY_CLIENT_SECRET', // Set via build environment variable
    showId: '4gpxvhJ8WyrGAnba5A6LQc' // Set via build environment variable
  },

  youtube: {
    apiKey: '', // Set via build environment variable
    channelId: '',
    playlistId: ''
  },

  applePodcasts: {
    podcastId: '',
    rssFeedUrl: ''
  }
};
