import type { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

/**
 * Netlify Function to retrieve the current Spotify access token
 *
 * This function:
 * 1. Retrieves the current access token from Netlify Blobs
 * 2. Returns the token along with expiration metadata
 * 3. Can be called from the frontend or other functions
 *
 * Endpoint: /.netlify/functions/get-spotify-token
 * Method: GET
 *
 * Response format:
 * {
 *   "access_token": "BQC...",
 *   "expires_at": "2025-11-21T23:00:00.000Z",
 *   "refreshed_at": "2025-11-21T22:00:00.000Z"
 * }
 */
export default async (req: Request, context: Context) => {
  try {
    // Get the token from Netlify Blobs
    const store = getStore("spotify");
    const token = await store.get("access_token", { type: "text" });
    const metadata = await store.getMetadata("access_token");

    if (!token) {
      return new Response(
        JSON.stringify({
          error: "No token available. The scheduled function may not have run yet.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", // Adjust for your domain in production
          },
        }
      );
    }

    // Check if token is expired
    const expiresAt = metadata?.expires_at ? new Date(metadata.expires_at as string) : null;
    const isExpired = expiresAt ? new Date() > expiresAt : false;

    return new Response(
      JSON.stringify({
        access_token: token,
        expires_at: metadata?.expires_at || null,
        refreshed_at: metadata?.refreshed_at || null,
        is_expired: isExpired,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Adjust for your domain in production
          "Cache-Control": "public, max-age=3000", // Cache for 50 minutes (token expires in 60)
        },
      }
    );
  } catch (error) {
    console.error("Error retrieving Spotify token:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to retrieve token",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
};
