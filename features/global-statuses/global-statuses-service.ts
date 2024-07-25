import { supabase } from "@/shared/supabase";
import { queryOptions } from "@tanstack/react-query";

export async function globalStatusesApi() {
  const { error, data } = await supabase
    .from("statuses")
    .select("*, profiles ( * )")
    .filter("isStatusPublic", "eq", true)
    .filter("isNotePublic", "eq", true)
    .filter("note", "not.is", null)
    .order("createdAt", { ascending: false });

  if (error) throw error;

  return data;
}

export const globalStatusesQueryOptions = queryOptions({
  queryKey: ["global-statuses"],
  queryFn: globalStatusesApi,
});
