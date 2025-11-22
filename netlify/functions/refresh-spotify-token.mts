import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

/**
 * Netlify Scheduled Function to refresh Spotify bearer token every hour
 *
 * This function:
 * 1. Fetches a new access token from Spotify using Client Credentials Flow
 * 2. Stores the token in Netlify Blobs for use by other functions/pages
 * 3. Runs automatically every hour
 *
 * Required Environment Variables:
 * - SPOTIFY_CLIENT_ID: Your Spotify application client ID
 * - SPOTIFY_CLIENT_SECRET: Your Spotify application client secret
 */
export default async (req: Request) => {
  console.log("Starting Spotify token refresh...");

  try {
    // Get environment variables
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Missing required environment variables: SPOTIFY_CLIENT_ID and/or SPOTIFY_CLIENT_SECRET");
    }

    // Prepare credentials for Spotify API
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    // Request new access token from Spotify
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Spotify API error (${response.status}): ${errorText}`);
    }

    const tokenData: SpotifyTokenResponse = await response.json();

    // Store the token in Netlify Blobs
    const store = getStore("spotify");
    await store.set("access_token", tokenData.access_token, {
      metadata: {
        expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
        refreshed_at: new Date().toISOString(),
      },
    });

    console.log("✓ Spotify token refreshed successfully");
    console.log(`Token expires in ${tokenData.expires_in} seconds`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Spotify token refreshed successfully",
        expires_in: tokenData.expires_in,
        refreshed_at: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error refreshing Spotify token:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

// Schedule the function to run every hour
export const config: Config = {
  schedule: "0 * * * *", // Run at minute 0 of every hour
};
