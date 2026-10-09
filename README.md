# Schnittstellenpass

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.0.

## Spotify API Configuration

This application integrates with the Spotify Web API to fetch podcast episode data and show information.

### Setup Instructions

1. **Create a Spotify Developer Account**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Log in with your Spotify account
   - Click "Create app"

2. **Configure Your App**
   - App name: `Schnittstellenpass` (or your preferred name)
   - App description: `Podcast website integration`
   - Redirect URI: `http://localhost:4200` (for development)
   - Which API/SDKs are you planning to use?: Select "Web API"
   - Accept the terms and click "Save"

3. **Get Your Credentials**
   - After creating the app, you'll see your **Client ID**
   - Click "Show client secret" to reveal your **Client Secret**
   - Copy both values

4. **Configure the Netlify Function**
   - The credentials are used only by the Netlify function `netlify/functions/spotify.mts`. The browser talks to that function at `/.netlify/functions/spotify` and never sees the credentials.
   - In the Netlify site settings under *Environment variables*, set `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`. Their scope must include **Functions** and **Builds**.
   - Builds: `scripts/fetch-episodes.mjs` calls the same function before `ng build` and writes the latest episodes to `public/generated/episodes.json`. Prerendering puts them into the HTML of the start page, so search engines see them. Without the Builds scope the build still succeeds, the page then only loads the episodes in the browser.
   - `SPOTIFY_SHOW_ID` is optional; it defaults to the Schnittstellenpass podcast.

### Important Notes

- **Never put the Client Secret into `src/environments/*` or any other frontend file.** Everything under `src/` is shipped to the browser. The Client Credentials flow is server-to-server only.
- **Never commit your actual credentials to Git!**
- For local development with Spotify data, run `npx netlify dev` instead of `ng serve`: it serves the app together with the function. Put the credentials into a `.env` file in the project root (already git-ignored). With plain `ng serve` the function is not available and the "Aktuelle Folge" card shows its fallback content.

## Instagram Feed ("Aus der Kabine")

The four tiles in the "Aus der Kabine" section show the latest Instagram posts. The Netlify function `netlify/functions/instagram.mts` loads them from the Instagram API and also serves their images. Visitors therefore only talk to this site, never to Instagram or Meta, so no cookie consent is needed for the feed. Clicking a tile opens the post on Instagram. Without a token, or if Instagram cannot be reached, the tiles keep their placeholders.

### Setup Instructions

1. **Professional account**
   - The Instagram account must be a Business or Creator account (Instagram app → Settings → *Account type and tools*).

2. **Create a Meta app**
   - Go to [Meta for Developers](https://developers.facebook.com/apps) and click *Create app*.
   - Choose the Instagram use case (Instagram API with Instagram Login).

3. **Generate an access token**
   - In the app dashboard, open *Instagram → API setup with Instagram login*.
   - Under *Generate access tokens*, click *Add account* and log in with the Schnittstellenpass account.
   - Copy the token; it is shown only once. The permission `instagram_business_basic` is sufficient.
   - If the account cannot be added, give it the *Instagram Tester* role under *App roles* and accept the invite in Instagram (Settings → *Website permissions → Apps and websites → Tester invites*).

4. **Configure the Netlify Function**
   - In the Netlify site settings under *Environment variables*, set `INSTAGRAM_ACCESS_TOKEN`. Its scope must include **Functions**.
   - Trigger a new deploy so the functions pick up the variable.

### Token renewal

- The token is valid for 60 days. The scheduled function `netlify/functions/instagram-token-refresh.mts` renews it once a week and stores the renewed token in Netlify Blobs (store `instagram`). Nothing has to be done manually.
- Scheduled functions only run on the published production deploy. Their runs are visible in Netlify under *Logs → Functions → instagram-token-refresh* ("Instagram token refreshed, valid for 60 days").
- If the token does expire (e.g. the site was paused for two months), it cannot be renewed anymore: generate a new one (step 3) and replace `INSTAGRAM_ACCESS_TOKEN`. A changed environment variable always takes precedence over the stored token.

### Important Notes

- **Never put the access token into `src/` or any other frontend file.**
- The post list is cached on the Netlify CDN for 15 minutes and the images for 7 days, so a new post can take up to about 15 minutes to appear.
- For local development, put `INSTAGRAM_ACCESS_TOKEN` into `.env` and run `npx netlify dev`.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Decap CMS (Admin UI)

Texts and photos of the start page can be edited at `/admin`. Changes are saved as drafts (a branch with a pull request) and go live once they are published in the CMS.

### Editable content files

- `public/content/home-hero.json` – headline and text of the hero section
- `public/content/live.json` – live section, banner and live photo
- `public/content/folgen.json` – texts of the episode section (the episodes themselves come from Spotify)
- `public/content/ueber-uns.json` – host section, portrait and facts
- `public/content/social.json` – headline of the Instagram section

### Editor interface

- `public/admin/config.yml` sets up the German interface, the logo, the link to the website and the sections in the order of the start page, with a hint and length limits for every field. The `name` of the collection and its files are part of the draft branch names (`cms/site_texts/live`): change labels and hints only, otherwise open drafts are lost.
- `public/admin/preview.js` and `preview.css` render the live preview next to the form in the colours and fonts of the website (fonts are copied to `admin/fonts` at build time, see `angular.json`). When the design of a section changes, update its preview too.
- Lists with a single field (the headline lines) are stored as plain strings, e.g. `"headlineLines": ["Jetzt", "auch live."]`.

### Login with GitHub

Editors log in with their GitHub account; everyone with write access to the repository can edit. Netlify handles the OAuth handshake, so no secret is stored in this repository.

One-time setup:

1. **GitHub OAuth app:** GitHub → Settings → Developer settings → OAuth Apps → *New OAuth App*
   - Homepage URL: `https://schnittstellenpass.de`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Register, then *Generate a new client secret*; keep the Client ID and the client secret at hand.
2. **Netlify:** Project configuration → Access & security → OAuth → Authentication providers → *Install provider* → GitHub, enter Client ID and client secret.
3. Open `https://schnittstellenpass.de/admin/` and click *Mit GitHub einloggen*.
4. **Switch off the old login** once the GitHub login works: in Netlify, disable Git Gateway (Identity → Services) and then Identity, and delete its users. Otherwise Git Gateway keeps its own write access to the repository, and Identity users could still commit through it.

Further editors are added as collaborators of the GitHub repository.

Decap CMS itself is served from this site (`public/vendor/decap-cms-<version>/`), not from a CDN; that folder's README describes how to update it.

**About the login token:** after logging in, the browser keeps a GitHub token in its local storage for schnittstellenpass.de. The CMS requests the `public_repo` scope, the smallest GitHub offers for this, but the token is then valid for *all* public repositories the editor can push to, not just this one, and logging out of the CMS does not revoke it. Editors should log out after editing and can revoke the access at any time under GitHub → Settings → Applications → *Authorized OAuth Apps*. If the repository is ever made private, change `auth_scope` in `public/admin/config.yml` to `repo`.

### Local testing

1. Start the app with `npm start`.
2. Start Decap local backend with `npx decap-server`. Without it, Decap falls back to the GitHub login of its demo site; do not authorize that.
3. Open `http://localhost:4200/admin/` (with the trailing slash).

`npm start` does not send the headers from `netlify.toml`. To test the CMS with its Content Security Policy, run `npx netlify dev` instead of `npm start` (together with `npx decap-server`) and open `http://localhost:8888/admin/`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
