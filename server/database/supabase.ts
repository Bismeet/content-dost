import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getConfig } from '../config.js';

let authClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

export function getSupabaseAuthClient(): SupabaseClient {
  if (!authClient) {
    const config = getConfig();
    authClient = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return authClient;
}

export function getSupabaseAdminClient(): SupabaseClient {
  if (!adminClient) {
    const config = getConfig();
    adminClient = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return adminClient;
}
