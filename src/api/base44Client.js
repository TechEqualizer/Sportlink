import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "688cfa78dd9c74dfc30b1e20", 
  requiresAuth: false // Temporarily disabled for local development
});
