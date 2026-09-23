const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/environments/environment.prod.ts');

const envConfigFile = `export const environment = {
  production: true,
  spotify: {
    showId: '${process.env.SPOTIFY_SHOW_ID || "4gpxvhJ8WyrGAnba5A6LQc"}'
  },
  applePodcasts: {
    podcastId: '${process.env.APPLE_PODCAST_ID || ""}',
    rssFeedUrl: '${process.env.APPLE_RSS_FEED_URL || ""}'
  }
};
`;

fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.error(err);
    throw err;
  }
  console.log(`Environment variables generated in ${targetPath}`);
});
