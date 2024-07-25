import type { SupabaseClient } from "@/shared/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  SignInWithOAuthCredentials,
  SignInWithPasswordlessCredentials,
  SignOut,
} from "@supabase/supabase-js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { useEffect } from "react";
import { Platform } from "react-native";
import { useSupabase } from "./core";
import { LargeSecureStore } from "./large-secure-store";

export function useHandleSessionFromURL() {
  const { supabase } = useSupabase();
  const url = Linking.useURL();

  const query = useQuery({
    queryKey: ["set_session"],
    queryFn: () => {
      if (!url) throw Error("unknown url");
      return createSessionFromUrl({ url, supabase });
    },
  });

  return query;
}

function authStore() {
  return SecureStore ? new LargeSecureStore() : AsyncStorage;
}

export const supabaseAuthConfig = (() => {
  return {
    auth: {
      storage: authStore(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  };
})();

if (Platform.OS === "web") {
  WebBrowser.maybeCompleteAuthSession(); // required for web only
}

const redirectTo = makeRedirectUri();

async function createSessionFromTokens({
  access_token,
  refresh_token,
  supabase,
}: {
  access_token: string;
  refresh_token: string;
  supabase: SupabaseClient;
}) {
  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
}

function createSessionFromUrl({
  supabase,
  url,
}: {
  url: string;
  supabase: SupabaseClient;
}) {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  return createSessionFromTokens({ supabase, access_token, refresh_token });
}

/* OAUTH */
type OAuthProvider = Pick<SignInWithOAuthCredentials, "provider">;
type OAuthOptions = Omit<
  Pick<SignInWithOAuthCredentials, "options">,
  "redirectTo" | "skipBrowserRedirect"
>;

type SupabaseOAuthConfig = OAuthProvider & OAuthOptions;

export const performOAuth = async ({
  supabase,
  provider,
  options,
}: { supabase: SupabaseClient } & SupabaseOAuthConfig) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      ...options,
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;

  const res = await WebBrowser.openAuthSessionAsync(
    data?.url ?? "",
    redirectTo,
  );

  if (res.type === "success") {
    const { url } = res;
    await createSessionFromUrl({ url, supabase });
  }

  return data;
};

export function useOAuth(props?: OAuthOptions) {
  const { supabase } = useSupabase();

  const mutation = useMutation({
    mutationFn: async (arg: SupabaseOAuthConfig) => {
      const data = await performOAuth({
        supabase,
        provider: arg.provider,
        options: (() => {
          const retOptions = cloneDeep(props?.options);
          merge(retOptions, [arg.options]);
          return retOptions;
        })(),
      });

      return data;
    },
    onError(err) {
      console.log(err);
    },
  });

  return mutation;
}

/* MAGIC LINK */
const sendMagicLink = async ({
  supabase,
  auth,
}: { supabase: SupabaseClient } & {
  auth: SignInWithPasswordlessCredentials;
}) => {
  const { error } = await supabase.auth.signInWithOtp(auth);

  if (error) throw error;
  // Email sent.
};

export function useMagicLink({
  options,
}: Pick<SignInWithPasswordlessCredentials, "options">) {
  const { supabase } = useSupabase();

  const mutation = useMutation({
    mutationFn(arg: { auth: SignInWithPasswordlessCredentials }) {
      const authRet = cloneDeep({ options });
      merge(authRet, [arg.auth]);
      return sendMagicLink({
        supabase,
        auth: authRet as SignInWithPasswordlessCredentials,
      });
    },
  });

  return mutation;
}

/* SIGN OUT */
async function performSignOut({
  supabase,
  scope,
}: { supabase: SupabaseClient } & SignOut) {
  const { error } = await supabase.auth.signOut({ scope });
  if (error) throw error;
}

export function useSignOut(props?: SignOut) {
  const { supabase } = useSupabase();

  const mutation = useMutation({
    mutationFn(mutateArgs?: SignOut) {
      return performSignOut({
        supabase,
        scope: mutateArgs?.scope ?? props?.scope,
      });
    },
  });

  return mutation;
}

/* NAVIGATE UTIL COMPONENT */
export function Navigate({
  type,
  href,
  onNavigate,
}: { onNavigate?: () => void } & (
  | {
      type: "push";
      href: Parameters<typeof router.push>[0];
    }
  | { type: "replace"; href: Parameters<typeof router.replace>[0] }
)) {
  useEffect(() => {
    switch (type) {
      case "push":
        router.push(href);
        onNavigate?.();
        break;
      case "replace":
        router.replace(href);
        onNavigate?.();
        break;
    }
  }, [href, onNavigate, type]);

  return null;
}
