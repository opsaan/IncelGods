import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const noopResult = Promise.resolve({ data: [], error: null });

function createNoopQueryBuilder() {
  return {
    select: () => createNoopQueryBuilder(),
    order: () => createNoopQueryBuilder(),
    limit: () => noopResult,
    eq: () => createNoopQueryBuilder(),
    insert: async () => ({ data: null, error: { message: 'Supabase is not configured.' } }),
    update: () => ({ eq: async () => ({ data: null, error: { message: 'Supabase is not configured.' } }) }),
    then: (resolve) => resolve({ data: [], error: null })
  };
}

function createNoopClient() {
  return {
    from: () => createNoopQueryBuilder(),
    channel: () => ({ on: () => ({ subscribe: () => ({}) }) }),
    removeChannel: () => {},
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ data: null, error: { message: 'Supabase is not configured.' } }),
      signOut: async () => ({})
    }
  };
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createNoopClient();
