# Schnittstellenpass

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.0.

## Environment Variables

The following environment variables are required for deployment:

### Spotify API Configuration

- `SPOTIFY_CLIENT_ID`: Your Spotify application client ID
- `SPOTIFY_CLIENT_SECRET`: Your Spotify application client secret

To obtain these credentials:
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application or use an existing one
3. Copy the Client ID and Client Secret

### Setting Environment Variables on Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the following variables:
   - `SPOTIFY_CLIENT_ID` with your Spotify Client ID
   - `SPOTIFY_CLIENT_SECRET` with your Spotify Client Secret

## Netlify Scheduled Functions

This project includes a scheduled Netlify function that automatically refreshes the Spotify bearer token every hour.

### Scheduled Functions

- **refresh-spotify-token**: Runs every hour (at minute 0) to refresh the Spotify access token
  - Fetches a new token using Client Credentials Flow
  - Stores the token in Netlify Blobs for use by the application
  - Location: `netlify/functions/refresh-spotify-token.mts`

### API Endpoints

- **GET** `/.netlify/functions/get-spotify-token`: Retrieves the current Spotify access token
  - Returns the token along with expiration metadata
  - Can be called from the frontend to get the current valid token

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

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
