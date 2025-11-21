# API Setup Guide for Schnittstellenpass

This guide will help you set up all the necessary API credentials to display your podcast episodes from Spotify, YouTube, and Apple Podcasts.

## 📋 Prerequisites

- Spotify account (free or premium)
- Google account (for YouTube API)
- Your podcast must be published on these platforms

---

## 🎵 Spotify API Setup

### Step 1: Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click the **"Create App"** button
4. Fill in the form:
   - **App Name**: `Schnittstellenpass Website`
   - **App Description**: `Website integration to display podcast episodes`
   - **Website**: Your website URL (or `http://localhost:4200` for now)
   - **Redirect URIs**: `http://localhost:4200/callback`
   - **Which API/SDKs are you planning to use?**: Select "Web API"
5. Accept the Terms of Service
6. Click **"Save"**

### Step 2: Get Your Credentials

1. In your app dashboard, you'll see:
   - **Client ID** (visible immediately)
   - **Client Secret** (click "Show Client Secret" to reveal)
2. **Copy both values** - you'll need them soon!

### Step 3: Get Your Podcast Show ID

**Option A: From Spotify URL**
1. Open [Spotify Web Player](https://open.spotify.com/)
2. Search for your podcast
3. Click on your podcast
4. Look at the URL in the browser:
   ```
   https://open.spotify.com/show/3IM0lmZxpFAY7CwMuv9H4g
                                    ^^^^^^^^^^^^^^^^^^^^^^^^
                                    This is your Show ID
   ```
5. Copy the Show ID (everything after `/show/`)

**Option B: Using Share Button**
1. Open Spotify (desktop or web)
2. Find your podcast
3. Click "..." → "Share" → "Copy Show Link"
4. Extract the Show ID from the URL

### Step 4: Add Credentials to Your Project

Open `src/environments/environment.development.ts` and update:

```typescript
spotify: {
  clientId: 'abc123def456',        // Paste your Client ID here
  clientSecret: 'xyz789uvw012',    // Paste your Client Secret here
  showId: '3IM0lmZxpFAY7CwMuv9H4g' // Paste your Show ID here
}
```

---

## 🎬 YouTube API Setup (for View Counts)

**Note**: YouTube provides view counts, which Spotify doesn't offer!

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Project name: `Schnittstellenpass`
4. Click **"Create"**

### Step 2: Enable YouTube Data API

1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for `YouTube Data API v3`
3. Click on it
4. Click **"Enable"**

### Step 3: Create API Key

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"API Key"**
3. Your API key will be generated
4. (Optional but recommended) Click "Restrict Key":
   - Under "API restrictions", select "Restrict key"
   - Choose "YouTube Data API v3"
   - Click "Save"
5. **Copy your API Key**

### Step 4: Get Your YouTube Channel ID

**Option A: From YouTube Studio**
1. Go to [YouTube Studio](https://studio.youtube.com/)
2. Click on "Settings" (gear icon)
3. Click "Channel" → "Advanced settings"
4. You'll see your **Channel ID**

**Option B: From Your Channel URL**
1. Go to your YouTube channel
2. Look at the URL:
   ```
   https://www.youtube.com/channel/UCxxxxxxxxxxxxxxxxxx
                                   ^^^^^^^^^^^^^^^^^^^^^^
                                   This is your Channel ID
   ```

**Option C: If you have a custom URL**
1. Go to your channel
2. View page source (Ctrl+U or Cmd+U)
3. Search for `"channelId"`
4. Copy the ID value

### Step 5: (Optional) Create a Podcast Playlist

If you have a dedicated playlist for podcast episodes:
1. Create a public playlist with all your podcast episodes
2. Copy the playlist ID from the URL:
   ```
   https://www.youtube.com/playlist?list=PLxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                         This is your Playlist ID
   ```

### Step 6: Add Credentials to Your Project

Open `src/environments/environment.development.ts` and update:

```typescript
youtube: {
  apiKey: 'AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxxxx',  // Your YouTube API Key
  channelId: 'UCxxxxxxxxxxxxxxxxxx',               // Your Channel ID
  playlistId: 'PLxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' // Optional: Playlist ID
}
```

---

## 🍎 Apple Podcasts Setup

**Good news**: Apple Podcasts doesn't require API keys! It uses the iTunes Search API which is free and public.

### Step 1: Get Your Podcast ID

**Option A: From Apple Podcasts URL**
1. Go to [Apple Podcasts](https://podcasts.apple.com/)
2. Search for your podcast
3. Look at the URL:
   ```
   https://podcasts.apple.com/us/podcast/podcast-name/id1234567890
                                                           ^^^^^^^^^^
                                                           This is your ID
   ```
4. Copy the numbers after `id`

**Option B: From iTunes**
1. Open iTunes or Music app
2. Find your podcast
3. Right-click → "Copy Link"
4. Extract the ID from the URL

### Step 2: Get Your RSS Feed URL

This is the **recommended approach** as the iTunes API has limitations.

Your RSS feed URL is typically provided by your podcast hosting platform:
- **Anchor**: `https://anchor.fm/s/[your-id]/podcast/rss`
- **Buzzsprout**: `https://feeds.buzzsprout.com/[your-id].rss`
- **Libsyn**: `https://[your-show].libsyn.com/rss`
- **Podbean**: `https://feed.podbean.com/[your-show]/feed.xml`
- **Spotify for Podcasters**: In Settings → Distribution → RSS Feed

### Step 3: Add Credentials to Your Project

Open `src/environments/environment.development.ts` and update:

```typescript
applePodcasts: {
  podcastId: '1234567890',                              // Your Apple Podcast ID
  rssFeedUrl: 'https://anchor.fm/s/xxxxx/podcast/rss'  // Your RSS feed URL
}
```

---

## 🔒 Security Best Practices

### For Development

✅ **DO:**
- Keep `environment.development.ts` with placeholder values in git
- Add your real credentials to `environment.development.ts` for local testing
- Never commit real credentials

### For Production

When deploying your app:

1. **Use Environment Variables** in your hosting platform:
   - **Netlify**: Site settings → Build & deploy → Environment variables
   - **Vercel**: Project settings → Environment Variables
   - **Firebase**: Use Firebase Functions config
   - **AWS**: Use Parameter Store or Secrets Manager

2. **Update `environment.ts`** to use build-time environment variables

3. **Never expose secrets** in client-side code for production

---

## ✅ Testing Your Setup

### 1. Start the Development Server

```bash
npm start
```

### 2. Check for Errors

Open the browser console (F12) and look for:
- ✅ No authentication errors
- ✅ Successful API responses
- ❌ If you see errors, verify your credentials

### 3. Test Individual Services

Create a test component and inject the services:

```typescript
import { SpotifyApiService } from './services/api.service';

constructor() {
  const spotify = inject(SpotifyApiService);

  spotify.getLatestEpisodes(5).subscribe({
    next: (episodes) => console.log('Spotify Episodes:', episodes),
    error: (err) => console.error('Error:', err)
  });
}
```

---

## 📊 What Data You Can Get

| Platform | Episodes | Titles | Descriptions | Images | Duration | **Play Counts** |
|----------|----------|--------|--------------|--------|----------|-----------------|
| Spotify  | ✅ Yes   | ✅ Yes | ✅ Yes       | ✅ Yes | ✅ Yes   | ❌ **No**       |
| YouTube  | ✅ Yes   | ✅ Yes | ✅ Yes       | ✅ Yes | ✅ Yes   | ✅ **Yes**      |
| Apple    | ✅ Yes   | ✅ Yes | ✅ Yes       | ✅ Yes | ✅ Yes   | ❌ **No**       |

**Important**: Only YouTube provides public view/play counts via API!

---

## 🆘 Troubleshooting

### Spotify Errors

**Error: "Invalid client"**
- Double-check your Client ID and Client Secret
- Make sure there are no extra spaces

**Error: "Invalid show ID"**
- Verify your Show ID is correct
- Try copying the URL again from Spotify

### YouTube Errors

**Error: "API key not valid"**
- Check that you've enabled YouTube Data API v3
- Verify your API key is correct
- Make sure there are no restrictions preventing localhost

**Error: "Quota exceeded"**
- YouTube has a daily quota of 10,000 units
- Each request costs units (typically 1-100)
- This usually means you've made too many requests

### Apple Podcasts / RSS Errors

**Error: "RSS feed not found"**
- Verify the RSS feed URL in your browser
- Make sure it's publicly accessible
- Check for CORS issues (you may need the rss2json proxy)

---

## 📚 Useful Links

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [iTunes Search API Documentation](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/)
- [RSS 2.0 Specification](https://www.rssboard.org/rss-specification)

---

## 🎉 Next Steps

Once you have your credentials set up:

1. ✅ Test each API service independently
2. ✅ Create a component to display episodes
3. ✅ Style your episode cards with Tailwind CSS
4. ✅ Add filtering and sorting functionality
5. ✅ Implement the unified podcast aggregator to combine all platforms

---

**Need Help?** Check the console for detailed error messages and refer to the official API documentation linked above.
