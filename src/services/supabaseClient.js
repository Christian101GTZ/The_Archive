/**
 * supabaseClient.js — Connection to the backend
 *
 * Creates the one shared Supabase client used across the app. It reads the
 * project URL and key from the environment and every service imports `supabase`
 * from here to talk to the database, auth, and file storage.
 */
import { createClient } from "@supabase/supabase-js";

const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail loudly with a clear message if the environment variables are missing,
// instead of letting createClient throw a cryptic error later. Copy .env.example
// to .env and fill in your project's values.
if (!URL || !KEY) {
  throw new Error(
    "Missing Supabase environment variables. Set VITE_SUPABASE_URL and " +
      "VITE_SUPABASE_ANON_KEY in your .env file (see .env.example)."
  );
}

export const supabase = createClient(URL, KEY);