import { LoadingScreen } from "@/shared/LoadingScreen";
import type { SupabaseClient } from "@/shared/supabase";
import { Session } from "@supabase/supabase-js";
import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReactNode, createContext, useContext, useEffect } from "react";

export const sessionQueryOptions = ({
  supabaseClient,
}: {
  supabaseClient: SupabaseClient;
}) =>
  queryOptions({
    queryKey: ["session"],
    queryFn: () =>
      supabaseClient.auth
        .getSession()
        .then(({ data: { session: _session } }) => {
          return _session ?? null;
        }),
    staleTime: Infinity,
  });

const supabaseContext = createContext<{ supabase: SupabaseClient } | undefined>(
  undefined
);

export function useSupabase() {
  const ctx = useContext(supabaseContext);
  if (!ctx) throw Error("wrap component with supabase provider");
  return ctx;
}

export function SupabaseAuthProvider({
  children,
  supabaseClient,
}: {
  children: ReactNode;
  supabaseClient: SupabaseClient;
}) {
  const queryClient = useQueryClient();
  if (!queryClient)
    throw Error("wrap this provider with tanstack query provider");

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      queryClient.setQueryData<Session | null>(
        sessionQueryOptions({ supabaseClient }).queryKey,
        () => session ?? null
      );
    });

    const {
      data: {
        subscription: { unsubscribe },
      },
    } = supabaseClient.auth.onAuthStateChange((_, session) => {
      queryClient.setQueryData<Session | null>(
        sessionQueryOptions({ supabaseClient }).queryKey,
        () => session ?? null
      );
    });

    return () => {
      unsubscribe();
    };
  }, [supabaseClient, queryClient]);

  return (
    <supabaseContext.Provider value={{ supabase: supabaseClient }}>
      {children}
    </supabaseContext.Provider>
  );
}

export function useSession() {
  const { supabase } = useSupabase();

  const { data: session, isLoading } = useQuery(
    sessionQueryOptions({ supabaseClient: supabase })
  );

  return { session, isLoading };
}

type AuthProps = { type: "protected" | "unprotected"; loading?: ReactNode } & ({
  children?: ReactNode;
} & {
  onSuccess?: () => ReactNode;
  onForbidden?: () => ReactNode;
  customSessionState?: ReturnType<typeof useSession>;
});
export function Auth(props: AuthProps) {
  const { session, isLoading } = props.customSessionState ?? useSession();

  if (isLoading) return <>{props?.loading ?? <LoadingScreen />}</>;

  if (props.type === "protected") {
    if (session)
      return props?.onSuccess ? props.onSuccess() : <>{props.children}</>;
    if (!session) return props.onForbidden ? props.onForbidden() : null;
  }

  if (props.type === "unprotected") {
    if (!session)
      return props?.onSuccess ? props.onSuccess() : <>{props.children}</>;
    if (session) return props.onForbidden ? props.onForbidden() : null;
  }

  return null;
}
