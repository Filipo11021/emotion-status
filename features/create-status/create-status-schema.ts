import { TablesInsert } from "@/shared/database-types";
import { z } from "zod";

export type CreateStatusDto = Pick<
	Required<TablesInsert<"statuses">>,
	"emotion" | "reason" | "note" | "isNotePublic" | "isStatusPublic"
>;

export const createStatusSchema = z.object({
	emotion: z.string(),
	reason: z.string(),
	note: z.string().optional(),
	isNotePublic: z.boolean(),
	isStatusPublic: z.boolean(),
});
