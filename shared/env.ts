import { z } from "zod";

export const env = z
  .object({
    EXPO_PUBLIC_SUPABASE_URL: z.string().url().optional(),
    EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    EXPO_PUBLIC_SUPABASE_PROJECT_ID: z.string(),
    NODE_ENV: z.enum(["development", "production", "test"]),
  })
  .transform((data) => {
    return {
      ...data,
      EXPO_PUBLIC_SUPABASE_URL: `https://${data.EXPO_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`,
    };
  })
  .parse(process.env);
