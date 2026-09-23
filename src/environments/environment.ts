export const environment = {
  production: false,

  // Spotify
  // The API credentials are NOT configured here: they must never be shipped to
  // the browser. The Netlify function netlify/functions/spotify.mts reads them
  // from server-side environment variables (see README.md).
  spotify: {
    showId: '4gpxvhJ8WyrGAnba5A6LQc' // Schnittstellenpass podcast show ID
  },

  // Apple Podcasts
  // No API key needed, but you'll need your podcast ID and RSS feed URL
  applePodcasts: {
    podcastId: 'YOUR_APPLE_PODCAST_ID',
    rssFeedUrl: 'YOUR_PODCAST_RSS_FEED_URL'
  }
};
