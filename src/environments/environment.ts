export const environment = {
  production: false,

  // Spotify
  // The API credentials are NOT configured here: they must never be shipped to
  // the browser. The Netlify function netlify/functions/spotify.mts reads them
  // from server-side environment variables (see README.md).
  spotify: {
    showId: '4gpxvhJ8WyrGAnba5A6LQc' // Schnittstellenpass podcast show ID
  }
};
