export const environment = {
  production: true,

  // IMPORTANT: For production, use environment variables from your hosting platform
  // Never commit real API keys to git!
  //
  // For Netlify/Vercel: Use environment variables in build settings
  // For Firebase: Use firebase functions config
  // For custom server: Use process.env

  spotify: {
    clientId: '', // Set via build environment variable
    clientSecret: '', // Set via build environment variable
    showId: '' // Set via build environment variable
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
