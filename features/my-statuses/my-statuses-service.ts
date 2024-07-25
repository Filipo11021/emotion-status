import { supabase } from "@/shared/supabase";
import { Session } from "@supabase/supabase-js";
import { queryOptions } from "@tanstack/react-query";

export async function myStatusesApi({
  session,
}: {
  session: Session | null | undefined;
}) {
  const { error, data } = await supabase
    .from("statuses")
    .select("*, profiles ( * )")
    .filter("userId", "eq", session?.user.id)
    .order("createdAt", { ascending: false });

  if (error) throw error;

  return data;
}

export const myStatusesQueryOptions = ({
  session,
}: {
  session: Session | null | undefined;
}) =>
  queryOptions({
    queryKey: ["my-statuses", session?.user.id],
    queryFn: () => myStatusesApi({ session }),
  });
