/**
 * API Service
 *
 * This file re-exports the SpotifyService to maintain compatibility.
 * For actual implementation, see spotify.service.ts
 */

import { SpotifyService } from './spotify.service';

// Re-export SpotifyService
export { SpotifyService };

// Export types from spotify.models.ts
export { Episode, ShowStats } from '../models/spotify.models';
