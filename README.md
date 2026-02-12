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

4. **Update Environment File**
   - Open `src/environments/environment.development.ts`
   - Replace `YOUR_SPOTIFY_CLIENT_ID` with your actual Client ID
   - Replace `YOUR_SPOTIFY_CLIENT_SECRET` with your actual Client Secret
   - The `showId` is already configured for the Schnittstellenpass podcast

### Important Notes

- **Never commit your actual credentials to Git!** The development environment file should only contain real credentials locally.
- For production deployments (Netlify, Vercel, etc.), set these as environment variables in your hosting platform.
- The Spotify API uses Client Credentials flow, which is suitable for server-side or public data access.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Decap CMS (Admin UI)

The project now includes a Decap CMS admin interface at `/admin`.

### Editable content files

- `public/content/home-hero.json`
- `public/content/ueber-uns.json`
- `public/content/warum-cards.json`

### Netlify setup for login

1. Enable **Identity** in Netlify.
2. Enable **Git Gateway** in Netlify Identity settings.
3. Invite editors via Netlify Identity.
4. Open `https://<your-domain>/admin` and log in via invite link.

### Local testing

1. Start the app with `npm start`.
2. Start Decap local backend with `npx decap-server`.
3. Open `http://localhost:4200/admin`.

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
