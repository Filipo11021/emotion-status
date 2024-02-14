import { supabaseAuthConfig } from "@/shared/auth/expo";
import { env } from "@/shared/env";
import { Database } from "@/shared/database-types";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient as _SupabaseClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

export const supabase = createClient<Database>(
	env.EXPO_PUBLIC_SUPABASE_URL,
	env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
	{ ...supabaseAuthConfig },
);

export type SupabaseClient = _SupabaseClient<Database>;
