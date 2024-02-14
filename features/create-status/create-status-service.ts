import { supabase } from "@/shared/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { CreateStatusDto, createStatusSchema } from "./create-status-schema";
import { Session } from "@supabase/supabase-js";

export async function createStatusApi({data, session}:{data: CreateStatusDto, session: Session | null | undefined}) {
	const { error } = await supabase.from("statuses").insert({...data, userId: session?.user.id});

	if (error) throw error;

	return null;
}

export function useCreateStatusForm() {
	const form = useForm<CreateStatusDto>({
		resolver: zodResolver(createStatusSchema),
		defaultValues: {
			isNotePublic: false,
			isStatusPublic: true
		}
	});

	return { form };
}
